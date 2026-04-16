import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Fetch from both 673 (General/Advanced) and 672 (Workshops)
    const [entries673, entries672] = await Promise.all([
      getFormEntries(673),
      getFormEntries(672)
    ]);
    
    // Combine and normalize entries
    const allEntries = [
        ...entries673.map(e => ({ ...e, formId: 673 })),
        ...entries672.map(e => ({ ...e, formId: 672 }))
    ];

    const payments = allEntries.map((e: any) => {
      const meta = e.meta || e.item_meta || {};
      
      // Robust Name detection - Prioritize modern numeric IDs first
      const name = meta['9792'] || meta['9771'] || meta['7876'] || meta['wly6y'] || 'Student';
      
      // Robust Email detection
      const email = meta['9793'] || meta['9772'] || meta['7yfjv'] || meta['l0s01'] || 'N/A';
      
      // Robust Course detection (Universal V3)
      const course = meta['mlsd4'] || meta['9789'] || meta['9770'] || meta['l9w7q'] || meta['7881'] || 'NanoSchool Program';
      
      // Robust Pricing detection
      const formattedAmount = String(meta['p30ad'] || meta['ijpy8'] || meta['9810'] || meta['9777'] || '0');
      const amountRaw = formattedAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountRaw) || 0;
      
      // Robust Status detection
      const rawStatus = (meta['2dnu4'] || meta['9817'] || meta['9777'] || '').toLowerCase();
      const status = (rawStatus === 'paid' || rawStatus === 'payment_success' || rawStatus === 'success') ? 'Paid' : 'Unpaid';
      
      // Robust Transaction ID detection
      const transactionId = meta['vdgya'] || meta['m80xc'] || meta['9819'] || meta['9816'] || meta['payment_id'] || 'N/A';

      // Robust Category detection (Intelligence Layer V3)
      const explicitCategory = String(meta['vtajg'] || meta['9823'] || '').toLowerCase();
      const isWorkshopSignature = !!(meta['9770'] || meta['9772'] || meta['9768'] || meta['9769']);
      const workshopKeywords = ['workshop', 'masterclass', 'bootcamp', 'training', 'session'];
      const hasWorkshopKeyword = workshopKeywords.some(kw => course.toLowerCase().includes(kw));
      
      const isInternship = course.toLowerCase().includes('internship') || explicitCategory === 'internship';
      const isWorkshop = e.formId === 672 || explicitCategory === 'workshop' || isWorkshopSignature || hasWorkshopKeyword;
      
      let category = 'Course';
      if (isInternship) category = 'Internship';
      else if (isWorkshop) category = 'Workshop';

      return {
        id: e.id,
        name,
        email,
        course,
        category,
        status,
        amount,
        formattedAmount,
        currency: formattedAmount.includes('₹') ? 'INR' : 'USD', 
        transactionId,
        state: meta['9801'] || meta['9775'] || meta['q2ct5'] || '',
        country: meta['9802'] || meta['9776'] || meta['yiu1i'] || 'India',
        address: meta['9800'] || meta['9774'] || meta['kt4ba'] || '',
        contactNumber: meta['jqnig'] || meta['ycnup'] || meta['9794'] || meta['9773'] || '',
        institution: meta['9824'] || meta['9796'] || meta['9795'] || meta['2mjze'] || '',
        pid: meta['9788'] || meta['9769'] || `NSTC-${e.id.slice(-4).toUpperCase()}`,
        zipCode: meta['9805'] || meta['dnoob'] || '',
        basePrice: parseFloat(meta['9825'] || '0') || null,
        date: e.created_at
      };
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error('Admin payments API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
  }
}
