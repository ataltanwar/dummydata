import { describe, it, expect } from 'vitest';
import {
  generatePANValue,
  generateTANValue,
  generateGSTINValue,
  generateAadhaarValue,
  generateIdentifiers
} from '../workforce';

describe('Workforce Compliance Generators', () => {
  describe('PAN Generator', () => {
    it('should generate a valid format individual PAN', () => {
      const pan = generatePANValue('P');
      expect(pan).toHaveLength(10);
      expect(pan[3]).toBe('P');
      expect(/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)).toBe(true);
    });

    it('should generate a valid format company PAN', () => {
      const pan = generatePANValue('C');
      expect(pan).toHaveLength(10);
      expect(pan[3]).toBe('C');
      expect(/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)).toBe(true);
    });

    it('should respect custom surname/company initials', () => {
      const pan = generatePANValue('P', 'K');
      expect(pan[4]).toBe('K');
    });
  });

  describe('TAN Generator', () => {
    it('should generate a valid format TAN', () => {
      const tan = generateTANValue();
      expect(tan).toHaveLength(10);
      expect(/^[A-Z]{4}\d{5}[A-Z]$/.test(tan)).toBe(true);
    });
  });

  describe('GSTIN Generator', () => {
    it('should generate a valid format GSTIN', () => {
      const gstin = generateGSTINValue();
      expect(gstin).toHaveLength(15);
      expect(gstin[13]).toBe('Z');
      expect(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z\d$/.test(gstin)).toBe(true);
    });
  });

  describe('Aadhaar Generator', () => {
    it('should generate a 12-digit format-valid Aadhaar', () => {
      const aadhaar = generateAadhaarValue();
      expect(aadhaar).toHaveLength(12);
      expect(/^\d{12}$/.test(aadhaar)).toBe(true);
      expect(aadhaar[0]).not.toBe('0'); // Real Aadhaar never starts with 0
    });
  });

  describe('Bulk Generator Wrapper', () => {
    it('should generate bulk sets matching requested count', () => {
      const list = generateIdentifiers('PAN', 5);
      expect(list).toHaveLength(5);
      list.forEach(item => {
        expect(/^[A-Z]{5}\d{4}[A-Z]$/.test(item)).toBe(true);
      });
    });

    it('should respect optional bank configuration values', () => {
      const bankAccounts = generateIdentifiers('BANK_ACCOUNT', 3, { bankDigits: 10 });
      expect(bankAccounts).toHaveLength(3);
      bankAccounts.forEach(acc => {
        expect(acc).toHaveLength(10);
        expect(/^\d{10}$/.test(acc)).toBe(true);
      });
    });
  });
});
