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

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function bulk(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? bulk(n % 100) : '');
    if (n < 100000) return bulk(Math.floor(n / 1000)) + ' Thousand ' + (n % 1000 !== 0 ? bulk(n % 1000) : '');
    if (n < 10000000) return bulk(Math.floor(n / 100000)) + ' Lakh ' + (n % 100000 !== 0 ? bulk(n % 100000) : '');
    return bulk(Math.floor(n / 10000000)) + ' Crore ' + (n % 10000000 !== 0 ? bulk(n % 10000000) : '');
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = bulk(integerPart);
  if (decimalPart > 0) {
    result += ' and ' + bulk(decimalPart) + ' Paise';
  }
  return result + ' Only';
}

export function calculateGST(totalAmount: number, country: string, state: string): TaxBreakdown {
  const isIndia = country?.toLowerCase() === 'india';
  
  // Normalize state for comparison
  const normalizedState = state?.toLowerCase()?.trim() || '';
  const isUP = normalizedState.includes('uttar pradesh') || normalizedState === 'up' || normalizedState === 'uttarpradesh';

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
  // Formula: Base = Total / (1 + Rate)
  const baseAmount = totalAmount / 1.18;
  const totalTax = totalAmount - baseAmount;

  if (isUP) {
    // Intrastate: CGST (9%) + SGST (9%)
    return {
      baseAmount,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      igst: 0,
      totalTax,
      grandTotal: totalAmount,
      taxStatus: 'Inclusive',
      description: 'GST Inclusive (9% CGST + 9% SGST)'
    };
  } else {
    // Interstate: IGST (18%)
    return {
      baseAmount,
      cgst: 0,
      sgst: 0,
      igst: totalTax,
      totalTax,
      grandTotal: totalAmount,
      taxStatus: 'Inclusive',
      description: 'GST Inclusive (18% IGST)'
    };
  }
}

// -------------------------------------------------------------
// NEW PRICING ALGORITHM (Forward Calculation from Base Price)
// -------------------------------------------------------------

export interface PricingInput {
  country: string; // ISO Code (e.g., 'IN', 'US') or Full Name
  state?: string;  // State Code (e.g., 'UP') or Full Name
  basePrice: number;
  currency: string; // ISO Currency Code (e.g., 'INR', 'USD', 'EUR')
}

export interface TaxDetails {
  taxType: 'CGST_SGST' | 'IGST' | 'INTERNATIONAL_TAX';
  totalTaxPercentage: number;
  cgstPercentage?: number;
  sgstPercentage?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  internationalTaxAmount?: number;
  totalTaxAmount: number;
}

export interface InvoiceBreakdown {
  currency: string;
  basePrice: number;
  extraChargePercentage: number;
  extraChargeAmount: number;
  taxableAmount: number;
  taxDetails: TaxDetails;
  totalPayableAmount: number;
  currencySymbol: string;
  description: string;
}

export function calculateEnrollmentPricing(input: PricingInput): InvoiceBreakdown {
  const { country, state, basePrice, currency } = input;
  
  // Normalize inputs for reliable checking
  const isIndia = ['IN', 'INDIA'].includes((country || '').toUpperCase());
  const isUPState = state && ['UP', 'UTTAR PRADESH'].includes(state.toUpperCase());
  
  let extraChargePercentage = 0;
  
  // Rule: International Users & Currency NOT USD -> 3% extra charge
  if (!isIndia && currency.toUpperCase() !== 'USD') {
    extraChargePercentage = 3;
  }

  const extraChargeAmount = (basePrice * extraChargePercentage) / 100;
  const taxableAmount = basePrice + extraChargeAmount;
  
  // Flat Tax Rate is 18%
  const taxRate = 18;
  const totalTaxAmount = (taxableAmount * taxRate) / 100;
  
  let taxDetails: TaxDetails;
  let description = '';

  if (isIndia) {
    if (isUPState) {
      // UP: 9% CGST + 9% SGST
      const splitTaxAmt = totalTaxAmount / 2;
      taxDetails = {
        taxType: 'CGST_SGST',
        totalTaxPercentage: taxRate,
        cgstPercentage: 9,
        sgstPercentage: 9,
        cgstAmount: splitTaxAmt,
        sgstAmount: splitTaxAmt,
        totalTaxAmount: totalTaxAmount,
      };
      description = 'GST Exclusive (9% CGST + 9% SGST)';
    } else {
      // Non-UP India: 18% IGST
      taxDetails = {
        taxType: 'IGST',
        totalTaxPercentage: taxRate,
        igstAmount: totalTaxAmount,
        totalTaxAmount: totalTaxAmount,
      };
      description = 'GST Exclusive (18% IGST)';
    }
  } else {
    // International: 18% Tax
    taxDetails = {
      taxType: 'INTERNATIONAL_TAX',
      totalTaxPercentage: taxRate,
      internationalTaxAmount: totalTaxAmount,
      totalTaxAmount: totalTaxAmount,
    };
    description = extraChargePercentage > 0 
      ? `Tax Exclusive (18%) + ${extraChargePercentage}% Currency Surcharge`
      : 'Tax Exclusive (18% Export Tax)';
  }

  // Round values for safe financial representation (assuming cents/paise)
  const roundCurrency = (num: number) => Math.round(num * 100) / 100;

  return {
    currency: currency.toUpperCase(),
    basePrice: roundCurrency(basePrice),
    extraChargePercentage,
    extraChargeAmount: roundCurrency(extraChargeAmount),
    taxableAmount: roundCurrency(taxableAmount),
    taxDetails: {
      ...taxDetails,
      cgstAmount: taxDetails.cgstAmount ? roundCurrency(taxDetails.cgstAmount) : undefined,
      sgstAmount: taxDetails.sgstAmount ? roundCurrency(taxDetails.sgstAmount) : undefined,
      igstAmount: taxDetails.igstAmount ? roundCurrency(taxDetails.igstAmount) : undefined,
      internationalTaxAmount: taxDetails.internationalTaxAmount ? roundCurrency(taxDetails.internationalTaxAmount) : undefined,
      totalTaxAmount: roundCurrency(taxDetails.totalTaxAmount),
    },
    totalPayableAmount: roundCurrency(taxableAmount + totalTaxAmount),
    currencySymbol: isIndia ? '₹' : (currency.toUpperCase() === 'USD' ? '$' : currency.toUpperCase()),
    description
  };
}
