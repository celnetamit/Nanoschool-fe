import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSystemConfig } from '@/lib/settings';

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
        const formattedAmount = String(meta['ijpy8'] || meta['9810'] || '0');
        const amountStr = formattedAmount.replace(/[^0-9.]/g, '');
        const amount = parseFloat(amountStr) || 0;
        const normalizedAmount = normalizeToINR(formattedAmount, amount, rates);
        const status = (meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success') ? 'Paid' : 'Unpaid';

        return {
          id: e.id,
          name: meta['wly6y'] || meta['9792'] || 'Unknown',
          email: meta['7yfjv'] || meta['9793'] || 'N/A',
          course: meta['mlsd4'] || meta['9789'] || 'Generic Enrollment',
          status,
          amount: normalizedAmount, // Return normalized amount for UI consistency
          rawAmount: amount,
          formattedAmount,
          date: e.created_at
        };
      })
    };

    // Calculate totals based on the original entries for admin, or filtered for user
    const entriesToSummarize = role === 'admin' ? entries : filteredEntries;
    entriesToSummarize.forEach((e: any) => {
      const meta = e.meta || e.item_meta || {};
      const formattedAmount = String(meta['ijpy8'] || meta['9810'] || '0');
      const amountStr = formattedAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountStr) || 0;
      const isPaid = meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success';

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
