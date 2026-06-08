export type IdentifierType =
  | 'PAN'
  | 'TAN'
  | 'GSTIN'
  | 'CIN'
  | 'AADHAAR'
  | 'ESIC'
  | 'UAN'
  | 'BANK_ACCOUNT'
  | 'IFSC'
  | 'EMPLOYEE_ID';

export interface IdentifierConfig {
  type: IdentifierType;
  label: string;
  tooltip: string;
  description: string;
  pattern: string;
  example: string;
}

// Verhoeff algorithm matrices for Aadhaar validation/generation
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

// State Codes for GSTIN
const stateCodes = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '26', '27', '29', '30', '31', '32',
  '33', '34', '35', '36', '37', '38'
];

// Industry class abbreviations for CIN
const industryClasses = ['PTC', 'PLC', 'OPC'];

const stateAbbrs = ['DL', 'MH', 'KA', 'HR', 'TN', 'GJ', 'WB', 'UP', 'KA', 'MH'];

const banks = [
  { code: 'SBIN', name: 'State Bank of India' },
  { code: 'HDFC', name: 'HDFC Bank' },
  { code: 'ICIC', name: 'ICICI Bank' },
  { code: 'UTIB', name: 'Axis Bank' },
  { code: 'BARB', name: 'Bank of Baroda' },
  { code: 'PUNB', name: 'Punjab National Bank' },
  { code: 'KKBK', name: 'Kotak Mahindra Bank' },
  { code: 'YESB', name: 'Yes Bank' },
  { code: 'IBKL', name: 'IDBI Bank' },
  { code: 'IDFB', name: 'IDFC First Bank' }
];

// Helper to generate random string of digits
function randomDigits(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Helper to generate random uppercase letters
function randomLetters(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generates format-valid but dummy Aadhaar
export function generateAadhaarValue(): string {
  // Real Aadhaar never starts with 0 or 1.
  // To keep it functional/format-valid but clearly dummy for testing:
  // We can start with '1' or '9'. In India, real Aadhaar numbers start with 2 through 9.
  // We will start with a dummy indicator '1' which is safe and valid under Verhoeff, but denotes standard testing data.
  const digits: number[] = [1];
  for (let i = 0; i < 10; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Calculate check digit
  let c = 0;
  const reversed = [...digits].reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[(i + 1) % 8][reversed[i]]];
  }
  const checksumValue = inv[c];
  digits.push(checksumValue);

  return digits.join('');
}

// Format Aadhaar smoothly as xxxx xxxx xxxx
export function formatAadhaar(val: string): string {
  return val.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
}

// Generates PAN based on status (e.g. 'P' for Individual, 'C' for Company)
export function generatePANValue(status: 'P' | 'C' = 'P', surnameInitial?: string): string {
  // AAAAA9999A
  // 4th char is status: 'P' for Individual, 'C' for Company, 'F' for Firm, 'H' for HUF, 'A' for AOP
  const prefix3 = randomLetters(3);
  const customInitial = surnameInitial && /^[A-Z]$/i.test(surnameInitial)
    ? surnameInitial.toUpperCase()
    : randomLetters(1);

  const digits = randomDigits(4);
  const suffix = randomLetters(1);

  return `${prefix3}${status}${customInitial}${digits}${suffix}`;
}

// Generates individual TAN
export function generateTANValue(nameInitial?: string): string {
  // AAAA99999A
  // First 3 chars represent location (e.g. DEL, MUM, BAN, HYD)
  const locations = ['DEL', 'MUM', 'BAN', 'HYD', 'MAA', 'PNQ', 'KOL', 'AMD'];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const nameChar = nameInitial && /^[A-Z]$/i.test(nameInitial)
    ? nameInitial.toUpperCase()
    : randomLetters(1);

  const digits = randomDigits(5);
  const suffix = randomLetters(1);

  return `${loc}${nameChar}${digits}${suffix}`;
}

// Generates GSTIN based on a PAN
export function generateGSTINValue(customPAN?: string): string {
  // 15 characters
  // State code (2 digits) + PAN (10 chars) + Entity code (1 active char) + Z (default) + checksum placeholder
  const stateCode = stateCodes[Math.floor(Math.random() * stateCodes.length)];
  const pan = customPAN || generatePANValue('C');
  const entityCode = Math.floor(Math.random() * 9 + 1).toString(); // '1' to '9' or uppercase
  const zChar = 'Z';
  const checksum = randomDigits(1); // Placeholder checksum digit

  return `${stateCode}${pan}${entityCode}${zChar}${checksum}`;
}

// Generates CIN
export function generateCINValue(stateCode?: string): string {
  // 21 characters: U72900RJ2025PTC123456
  // Listing status: L or U
  const listed = Math.random() > 0.8 ? 'L' : 'U';
  // 5 digit NIC code
  const nicCodes = ['72900', '24232', '65191', '45203', '15122', '31908', '93000', '51101'];
  const nic = nicCodes[Math.floor(Math.random() * nicCodes.length)];
  // State code
  const state = stateCode || stateAbbrs[Math.floor(Math.random() * stateAbbrs.length)];
  // Year (2000 to 2026)
  const year = Math.floor(Math.random() * 26 + 2000).toString();
  // Class
  const cls = industryClasses[Math.floor(Math.random() * industryClasses.length)];
  // 6 digit registration code
  const regNumber = randomDigits(6);

  return `${listed}${nic}${state}${year}${cls}${regNumber}`;
}

// Generates UAN
export function generateUANValue(): string {
  // starts with 10 (12 digits)
  return `10${randomDigits(10)}`;
}

// Generates ESIC
export function generateESICValue(): string {
  // Format: XX-XX-XXXXXX-XXX-XXXX (17 digits)
  const segment1 = stateCodes[Math.floor(Math.random() * stateCodes.length)];
  const segment2 = randomDigits(2);
  const segment3 = randomDigits(6);
  const segment4 = randomDigits(3);
  const segment5 = randomDigits(4);

  return `${segment1}-${segment2}-${segment3}-${segment4}-${segment5}`;
}

// Generates Bank Account Number
export function generateBankAccountValue(length: number = 12): string {
  const len = Math.max(9, Math.min(18, length));
  return randomDigits(len);
}

// Generates IFSC
export function generateIFSCValue(bankCode?: string): string {
  // AAAA0XXXXXX
  const bank = bankCode || banks[Math.floor(Math.random() * banks.length)].code;
  const suffix = randomLetters(2) + randomDigits(4); // Alphanumeric
  return `${bank}0${suffix}`;
}

// Generates Employee ID
export function generateEmployeeIDValue(prefix: string = 'EMP', serial: number = 1): string {
  const serialStr = serial.toString().padStart(4, '0');
  return `${prefix}-${serialStr}`;
}

export interface GenerationConfig {
  bankCode?: string;
  bankDigits?: number;
}

// Bulk identifier generator helper
export function generateIdentifiers(type: IdentifierType, count: number, config: GenerationConfig = {}): string[] {
  const { bankCode, bankDigits = 12 } = config;
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'PAN':
        results.push(generatePANValue('P'));
        break;
      case 'TAN':
        results.push(generateTANValue());
        break;
      case 'GSTIN':
        results.push(generateGSTINValue());
        break;
      case 'CIN':
        results.push(generateCINValue());
        break;
      case 'AADHAAR':
        results.push(formatAadhaar(generateAadhaarValue()));
        break;
      case 'ESIC':
        results.push(generateESICValue());
        break;
      case 'UAN':
        results.push(generateUANValue());
        break;
      case 'BANK_ACCOUNT':
        results.push(generateBankAccountValue(bankDigits));
        break;
      case 'IFSC':
        results.push(generateIFSCValue(bankCode));
        break;
      case 'EMPLOYEE_ID':
        results.push(generateEmployeeIDValue('EMP', i + 1));
        break;
      default:
        results.push('');
    }
  }
  return results;
}


export const identifierConfigs: Record<IdentifierType, IdentifierConfig> = {
  PAN: {
    type: 'PAN',
    label: 'PAN (Permanent Account Number)',
    tooltip: 'PAN',
    description: '10-character alphanumeric identifier issued by the Income Tax Department.',
    pattern: '5 letters (AAAAA) + 4 digits (9999) + 1 letter (A)',
    example: 'ABCDE1234F'
  },
  TAN: {
    type: 'TAN',
    label: 'TAN (Tax Deduction Account Number)',
    tooltip: 'TAN',
    description: '10-character alphanumeric identifier for entities responsible for deducting tax.',
    pattern: '4 letters (AAAA) + 5 digits (99999) + 1 letter (A)',
    example: 'DELR12345A'
  },
  GSTIN: {
    type: 'GSTIN',
    label: 'GSTIN (GST Identification Number)',
    tooltip: 'GST IN',
    description: '15-character identifier containing state code, merchant PAN, entity ID, and checksum.',
    pattern: '2-digit state code + 10-char company PAN + 1 unit code + Z + 1 checksum',
    example: '08ABCDE1234F1Z5'
  },
  CIN: {
    type: 'CIN',
    label: 'CIN (Corporate Identification Number)',
    tooltip: 'CIN',
    description: '21-character corporate identity number given to registered companies in India.',
    pattern: 'Listing(1) + Industry NIC(5) + State(2) + Year(4) + Ownership(3) + RegNo(6)',
    example: 'U72900RJ2025PTC123456'
  },
  AADHAAR: {
    type: 'AADHAAR',
    label: 'Aadhaar Number',
    tooltip: 'Aadhar',
    description: '12-digit format-valid identifier compliant with Verhoeff check digits for testing.',
    pattern: '12 digits with spaces (xxxx xxxx xxxx)',
    example: '1802 3412 9051'
  },
  ESIC: {
    type: 'ESIC',
    label: 'ESIC Employee ID',
    tooltip: 'ESIC',
    description: '17-digit numeric code assigned under the State Insurance scheme.',
    pattern: 'State(2) - Reg(2) - Unit(6) - Sub(3) - Code(4)',
    example: '31-12-345678-001-2003'
  },
  UAN: {
    type: 'UAN',
    label: 'UAN (Universal Account Number)',
    tooltip: 'UAN',
    description: '12-digit universal number issued to EPFO members.',
    pattern: '12 digits starting with "10"',
    example: '100123456789'
  },
  BANK_ACCOUNT: {
    type: 'BANK_ACCOUNT',
    label: 'Bank Account Number',
    tooltip: 'Bank Account',
    description: 'Configurable 9-to-18 digit generic testing banking identifiers.',
    pattern: '9 to 18 arbitrary digits',
    example: '101248591023'
  },
  IFSC: {
    type: 'IFSC',
    label: 'IFSC (Indian Financial System Code)',
    tooltip: 'IFSC',
    description: '11-character code identifying bank branches for electronic transfers.',
    pattern: '4 letters (AAAA) + 0 + 6 alphanumeric characters',
    example: 'SBIN0001234'
  },
  EMPLOYEE_ID: {
    type: 'EMPLOYEE_ID',
    label: 'Employee ID',
    tooltip: 'Employee ID',
    description: 'Customizable sequence corporate organizational identifiers.',
    pattern: '[Prefix]-[4-digit sequential count]',
    example: 'EMP-0042'
  }
};
