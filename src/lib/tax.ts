/**
 * Taxation utility for Indian GST (18% inclusive)
 * Rules:
 * - If India & UP: CGST (9%) + SGST (9%)
 * - If India & !UP: IGST (18%)
 * - Else: No Tax
 */

export interface TaxBreakdown {
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  taxStatus: 'Inclusive' | 'Exempt';
  description: string;
}

export const STATE_CODES: Record<string, string> = {
  'Andhra Pradesh': '37',
  'Arunachal Pradesh': '12',
  'Assam': '18',
  'Bihar': '10',
  'Chhattisgarh': '22',
  'Goa': '30',
  'Gujarat': '24',
  'Haryana': '06',
  'Himachal Pradesh': '02',
  'Jharkhand': '20',
  'Karnataka': '29',
  'Kerala': '32',
  'Madhya Pradesh': '23',
  'Maharashtra': '27',
  'Manipur': '14',
  'Meghalaya': '17',
  'Mizoram': '15',
  'Nagaland': '13',
  'Odisha': '21',
  'Punjab': '03',
  'Rajasthan': '08',
  'Sikkim': '11',
  'Tamil Nadu': '33',
  'Telangana': '36',
  'Tripura': '16',
  'Uttar Pradesh': '09',
  'Uttarakhand': '05',
  'West Bengal': '19',
  'Andaman and Nicobar Islands': '35',
  'Chandigarh': '04',
  'Dadra and Nagar Haveli and Daman and Diu': '26',
  'Delhi': '07',
  'Jammu and Kashmir': '01',
  'Ladakh': '38',
  'Lakshadweep': '31',
  'Puducherry': '34'
};

export function getStateCode(state: string): string {
  if (!state) return '';
  const search = state.toLowerCase().trim();
  // Try exact match first
  const entry = Object.entries(STATE_CODES).find(([name]) => name.toLowerCase() === search);
  if (entry) return entry[1];
  
  // Try partial match
  const partial = Object.entries(STATE_CODES).find(([name]) => search.includes(name.toLowerCase()));
  return partial ? partial[1] : '';
}

export function calculateGST(totalAmount: number, country: string, state: string): TaxBreakdown {
  const isIndia = country?.toLowerCase() === 'india';
  const isUP = state?.toLowerCase().includes('uttar pradesh') || state?.toLowerCase() === 'up';

  if (!isIndia) {
    return {
      baseAmount: totalAmount,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalTax: 0,
      grandTotal: totalAmount,
      taxStatus: 'Exempt',
      description: 'Tax Exempt (Export)'
    };
  }

  // 18% Inclusive GST calculation
  // Base = Total / 1.18
  const baseAmount = totalAmount / 1.18;
  const totalTax = totalAmount - baseAmount;

  if (isUP) {
    return {
      baseAmount,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      igst: 0,
      totalTax,
      grandTotal: totalAmount,
      taxStatus: 'Inclusive',
      description: 'GST Inclusive (UP)'
    };
  } else {
    return {
      baseAmount,
      cgst: 0,
      sgst: 0,
      igst: totalTax,
      totalTax,
      grandTotal: totalAmount,
      taxStatus: 'Inclusive',
      description: 'GST Inclusive (IGST)'
    };
  }
}
