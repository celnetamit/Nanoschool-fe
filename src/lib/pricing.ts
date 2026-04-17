/**
 * SINGLE SOURCE OF TRUTH (S.O.T.) - Pricing Engine
 * Handles strict, deterministic payment calculations for Fintech-grade compliance.
 * 
 * Business Rules:
 * 1. Base Price: Starting point.
 * 2. Tax: 18% Flat (IGST or CGST/SGST 9% each if UP, India).
 * 3. Surcharge: 3% of basePrice if currency NOT IN ["INR", "USD"].
 * 4. Formula: finalTotal = basePrice + taxAmount + surchargeAmount.
 * 5. Deterministic Rounding: 2 decimal places.
 */

export interface PricingInput {
    basePrice: number | string;
    currency: string; // ISO Code (INR, USD, EUR, etc.)
    country: string;  // India, etc.
    state?: string;   // Uttar Pradesh, etc.
    isInclusive?: boolean; // If true, basePrice is treated as the TOTAL paid
}

export interface PricingBreakdown {
    basePrice: number;
    currency: string;
    currencySymbol: string;
    taxAmount: number;
    taxType: 'CGST_SGST' | 'IGST' | 'INTERNATIONAL';
    cgstAmount: number | null;
    sgstAmount: number | null;
    igstAmount: number | null;
    surchargeAmount: number;
    finalTotal: number;
    breakdownLabel: string;
}

/**
 * Locale-aware number parser. Applied ONLY at input boundaries.
 */
export function parseLocalizedNumber(value: string | number | undefined | null): number {
    if (value == null) return 0;
    if (typeof value === 'number') return value;
    
    const str = String(value).trim();
    if (!str) return 0;
    
    const dotIndex = str.lastIndexOf('.');
    const commaIndex = str.lastIndexOf(',');
    
    let cleaned = str.replace(/[^0-9.,-]/g, '');
    
    if (commaIndex > dotIndex) {
        cleaned = cleaned.replace(/\./g, '').replace(/,/g, '.');
    } else {
        cleaned = cleaned.replace(/,/g, '');
    }
    
    const result = parseFloat(cleaned);
    return isNaN(result) ? 0 : result;
}

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export function calculateFinalPricing(input: PricingInput): PricingBreakdown {
    const rawPrice = parseLocalizedNumber(input.basePrice);
    const currency = (input.currency || 'USD').toUpperCase();
    const isIndia = ['INDIA', 'IN'].includes(input.country.toUpperCase());
    const isUP = isIndia && input.state && ['UTTAR PRADESH', 'UP'].includes(input.state.toUpperCase());
    
    const taxRate = 0.18; // 18%
    const surchargeRate = currency !== 'INR' ? 0.03 : 0; // 3%
    
    let basePrice: number;
    let taxAmount: number;
    let surchargeAmount: number;
    let finalTotal: number;

    if (input.isInclusive) {
        finalTotal = rawPrice;
        // Total = Base * (1 + 0.18 + SurchargeRate)
        basePrice = finalTotal / (1 + taxRate + surchargeRate);
        taxAmount = basePrice * taxRate;
        surchargeAmount = basePrice * surchargeRate;
    } else {
        basePrice = rawPrice;
        taxAmount = basePrice * taxRate;
        surchargeAmount = basePrice * surchargeRate;
        finalTotal = basePrice + taxAmount + surchargeAmount;
    }

    // Determine specific tax split
    let taxType: PricingBreakdown['taxType'] = isIndia ? (isUP ? 'CGST_SGST' : 'IGST') : 'INTERNATIONAL';
    
    // -----------------------------------------------------------------
    // DETERMINISTIC ROUNDING (FINTECH COMPLIANCE)
    // -----------------------------------------------------------------
    const roundedBase = round(basePrice);
    const roundedSurcharge = round(surchargeAmount);
    const roundedTax = round(taxAmount);
    const finalRoundedTotal = round(roundedBase + roundedSurcharge + roundedTax);

    let cgstAmount = null;
    let sgstAmount = null;
    let igstAmount = null;

    if (taxType === 'CGST_SGST') {
        cgstAmount = round(roundedTax / 2);
        sgstAmount = round(roundedTax / 2);
    } else if (taxType === 'IGST') {
        igstAmount = roundedTax;
    }

    const currencySymbol = isIndia ? '₹' : (currency === 'USD' ? '$' : currency);

    return {
        basePrice: roundedBase,
        currency,
        currencySymbol,
        taxAmount: roundedTax,
        taxType,
        cgstAmount,
        sgstAmount,
        igstAmount,
        surchargeAmount: roundedSurcharge,
        finalTotal: finalRoundedTotal,
        breakdownLabel: `${isIndia ? (isUP ? '9% CGST + 9% SGST' : '18% IGST') : '18% Export Tax'} ${surchargeRate > 0 ? '+ 3% Extra Charge' : ''}`
    };
}
