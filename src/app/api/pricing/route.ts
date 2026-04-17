import { NextResponse } from 'next/server';
import { calculateFinalPricing, PricingInput } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const body: PricingInput = await request.json();
    
    if (!body.basePrice || !body.currency || !body.country) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: basePrice, currency, country' 
      }, { status: 400 });
    }

    const breakdown = calculateFinalPricing(body);

    return NextResponse.json({ 
      success: true, 
      breakdown 
    });
  } catch (error: any) {
    console.error('Pricing API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to calculate pricing' 
    }, { status: 500 });
  }
}
