![Logo](https://raw.githubusercontent.com/ataltanwar/dummydata/refs/heads/main/public/favicon.ico) # Dummy Data Generator


Generate format-valid, compliance and workforce identifiers for development, QA, testing, demos, and staging environments. This utility helps developers build and test registration forms, validation routines, and financial services apps with realistic testing data that passes format validation checks.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

---
## Live Demo:
https://dummmydata.vercel.app/
---

## Features

### Supported generators:

* PAN (Permanent Account Number)
* GSTIN (Goods and Services Tax Identification Number)
* TAN (Tax Deduction and Collection Account Number)
* CIN (Corporate Identification Number)
* UAN (Universal Account Number)
* ESIC Number
* Employee IDs

### Bulk Data Generation

* Generate individual records or large datasets instantly
* Support for bulk generation of up to 500 records
* Fast client-side processing with no backend dependency

### Export & Productivity Tools

* One-click copy
* Bulk generation
* CSV export
* Mobile-friendly interface

### Modern User Experience

* Responsive SaaS-inspired design
* Mobile, tablet, and desktop optimized
* Dark and Light theme support
* Real-time toast notifications
* Accessible and intuitive user interactions

### Privacy & Safety

* Fully client-side generation
* No data storage or transmission
* Synthetic testing data only.
* Built-in testing-use disclaimers.

---

##  Supported Identifiers & Formats

| Identifier | Description | Format / Pattern | Example |
| :--- | :--- | :--- | :--- |
| **PAN** | Permanent Account Number (Individual) | `AAAAA9999A` | `ABCDE1234F` |
| **TAN** | Tax Deduction Account Number | `AAAA99999A` | `DELR12345A` |
| **GSTIN** | GST Identification Number | `[StateCode][PAN][EntityCode]Z[Checksum]` | `08ABCDE1234F1Z5` |
| **CIN** | Corporate Identification Number | `[L/U][NIC][StateCode][Year][Class][RegNo]` | `U72900RJ2025PTC123456` |
| **Aadhaar** | 12-digit UIDAI format-valid number | `12 digits` (compliant with Verhoeff check digits) | `1802 3412 9051` |
| **ESIC** | Employee State Insurance Corporation ID | `XX-XX-XXXXXX-XXX-XXXX` | `31-12-345678-001-2003` |
| **UAN** | Universal Account Number (EPFO) | 12 digits starting with `10` | `100123456789` |
| **Bank Account** | Configurable length bank account numbers | 9 to 18 digits | `101248591023` |
| **IFSC** | Indian Financial System Code | `[BankCode]0[BranchCode]` (11 alphanumeric) | `SBIN0001234` |
| **Employee ID** | Organizational identifier | `[Prefix]-[SequentialCount]` | `EMP-0042` |

---

##  Technology Stack

* **Frontend Framework**: React 19 + TypeScript
* **Build Tool**: Vite 6.4.3
* **Styling**: Tailwind CSS v4
* **Animation Library**: Motion (Framer Motion)
* **Icon Library**: Lucide React
* **Test Framework**: Vitest
* **Toast system**: Sonner

## Use Cases

### Developers

Generate realistic test identifiers during application development.

### QA Engineers

Create repeatable datasets for testing workflows and validation rules.

### Product Teams

Demonstrate compliance-related workflows without exposing sensitive information.

### Training & Education

Use realistic sample identifiers in learning environments.

## Disclaimer

All generated identifiers are synthetic and intended solely for:

* Development
* Testing
* QA
* Training
* Demonstration purposes

Generated values do not represent real individuals, businesses, or government-issued records.

Do not use generated identifiers for fraud, impersonation, or production compliance submissions.

----

## Local Development

### Clone Repository

```bash
git clone https://github.com/ataltanwar/dummydata.git
cd dummydata
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

##  Project Structure

```
├── Docs/                
│   └── README.md       
├── public/               
│   └── favicon.ico
├── src/
│   ├── components/       
│   ├── generators/        
│   │   └── __tests__/     
│   ├── pages/             
│   ├── utils/            
│   ├── App.tsx            
│   ├── index.css         
│   └── main.tsx   
├── package.json          
├── tsconfig.json         
└── vite.config.ts         
```

## Performance

* Client-side generation
* No server dependency
* Lightweight bundle
* Fast generation for large datasets
* Mobile-optimized experience

## Roadmap

* Excel export support
* Additional compliance identifiers
* Advanced generation presets
* Saved generation templates
* Enhanced validation tooling

## Author

**Atal Tanwar**

Portfolio: https://ataltanwar.vercel.app

GitHub: https://github.com/ataltanwar

## License

MIT License
