import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src/data/system-config.json');

export interface SystemConfig {
  invoice: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    gstin: string;
    supportEmail: string;
    website: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    signatureUrl: string;
  };
  certificate: {
    prefix: string;
    year: string;
    authorityName: string;
    authorityTitle: string;
    signatureUrl: string;
    templateUrl: string;
  };
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export function getSystemConfig(): SystemConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return getDefaultConfig();
    }
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading system config:', error);
    return getDefaultConfig();
  }
}

export function saveSystemConfig(config: SystemConfig): boolean {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving system config:', error);
    return false;
  }
}

function getDefaultConfig(): SystemConfig {
  return {
    invoice: {
      companyName: "IT Break Com Private Limited",
      addressLine1: "A-118, Level 1B, Sector 63",
      addressLine2: "Noida, Gautambuddha Nagar",
      addressLine3: "Uttar Pradesh, 201301",
      gstin: "06AAHCN1234F1Z8",
      supportEmail: "support@nanoschool.in",
      website: "nanoschool.in",
      bankName: "ICICI Bank Ltd",
      accountName: "IT Break com pvt LTD.",
      accountNumber: "012345678901",
      ifscCode: "ICIC0000123",
      signatureUrl: "/images/signatures/director.png"
    },
    certificate: {
      prefix: "NS",
      year: "2026",
      authorityName: "Director, NanoSchool",
      authorityTitle: "Authorised Controller",
      signatureUrl: "/images/signatures/director.png",
      templateUrl: "/images/templates/certificate-bg.png"
    },
    branding: {
      logoUrl: "/logo.png",
      primaryColor: "#2563eb",
      secondaryColor: "#0f172a"
    }
  };
}
