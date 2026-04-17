import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSystemConfig } from '@/lib/settings';
import { parseLocalizedNumber } from '@/lib/tax';

async function getExchangeRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    return { INR: 84, USD: 1, EUR: 0.9, GBP: 0.8, AED: 3.67 }; // Basic fallbacks
  }
}

function normalizeToINR(amountStr: string, rawAmount: number, rates: Record<string, number>) {
  const str = amountStr.toUpperCase();
  const inrRate = rates.INR || 84;
  
  let sourceRate = 1; // Default to USD if $ or USD found, or if no known symbol but non-INR string
  
  if (str.includes('₹') || str.includes('INR')) return rawAmount;
  if (str.includes('$') || str.includes('USD')) sourceRate = rates.USD || 1;
  else if (str.includes('€') || str.includes('EUR')) sourceRate = rates.EUR || 0.9;
  else if (str.includes('£') || str.includes('GBP')) sourceRate = rates.GBP || 0.8;
  else if (str.includes('AED')) sourceRate = rates.AED || 3.67;
  else if (str.includes('OMR')) sourceRate = rates.OMR || 0.38;
  
  // Amount in INR = Amount in Source * (INR_per_USD / Source_per_USD)
  return rawAmount * (inrRate / sourceRate);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const role = (session.user as any).role;
  const user = session.user.email!;

  try {
    const entries = await getFormEntries(673);
    const config = getSystemConfig();
    const rates = await getExchangeRates();
    
    // If student, filter entries to only their own
    const filteredEntries = role === 'admin' 
      ? entries 
      : entries.filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = meta['7yfjv'] || meta['9793'];
          return email?.toLowerCase() === user.toLowerCase();
        });

    const stats = {
      total: role === 'admin' ? entries.length : filteredEntries.length,
      paid: 0,
      unpaid: 0,
      revenue: 0,
      revenueTarget: config.fiscal.revenueTarget,
      recent: filteredEntries.slice(0, 10).map((e: any) => {
        const meta = e.meta || e.item_meta || {};
        
        // Unified Mapping
        const name = meta['9792'] || meta['9771'] || meta['7876'] || meta['wly6y'] || 'Student';
        const email = meta['9793'] || meta['9772'] || meta['7yfjv'] || meta['l0s01'] || 'N/A';
        const course = meta['mlsd4'] || meta['9789'] || meta['9770'] || meta['l9w7q'] || meta['7881'] || 'NanoSchool Program';
        
        const formattedAmount = String(meta['p30ad'] || meta['9810'] || meta['ijpy8'] || meta['9777'] || '0');
        const amount = parseLocalizedNumber(formattedAmount);
        const normalizedAmount = normalizeToINR(formattedAmount, amount, rates);
        
        const rawStatus = (meta['2dnu4'] || meta['9817'] || meta['9777'] || '').toLowerCase();
        const status = (rawStatus === 'paid' || rawStatus === 'payment_success' || rawStatus === 'success') ? 'Paid' : 'Unpaid';

        return {
          id: e.id,
          name,
          email,
          course,
          status,
          amount: normalizedAmount,
          rawAmount: amount,
          formattedAmount,
          pricingBreakdown: meta['9832'] ? JSON.parse(meta['9832']) : null,
          date: e.created_at
        };
      })
    };

    // Calculate totals based on the original entries for admin, or filtered for user
    entriesToSummarize.forEach((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const formattedAmount = String(meta['p30ad'] || meta['9810'] || meta['ijpy8'] || meta['9777'] || '0');
      const amount = parseLocalizedNumber(formattedAmount);
      
      const rawStatus = (meta['2dnu4'] || meta['9817'] || meta['9777'] || '').toLowerCase();
      const isPaid = rawStatus === 'paid' || rawStatus === 'payment_success' || rawStatus === 'success';

      if (isPaid) {
        stats.paid++;
        stats.revenue += normalizeToINR(formattedAmount, amount, rates);
      } else {
        stats.unpaid++;
      }
    });

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
