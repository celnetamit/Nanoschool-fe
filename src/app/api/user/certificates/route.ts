import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    return NextResponse.json({ success: false, error: 'User email not found' }, { status: 400 });
  }

  try {
    // Fetch from 673 (Courses & Workshops) and 554 (Internships)
    const [registrations673, internships] = await Promise.all([
       getFormEntries(673),
       getFormEntries(554)
    ]);

    // Filter and normalize entries for the current user
    const certificates = [
      ...registrations673
        .filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = meta['9793'] || meta['7yfjv'] || meta['9772'];
          const rawStatus = meta['9817'] || meta['2dnu4'] || meta['9777'];
          const isPaid = rawStatus === 'payment_success' || rawStatus === 'Paid';
          return email?.toLowerCase() === userEmail.toLowerCase() && isPaid;
        })
        .map((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const productTitle = meta['9789'] || meta['mlsd4'] || meta['9770'] || 'Academy Program';
          const type = productTitle.toLowerCase().includes('internship') ? 'Internship' : 'Academy Program';
          return normalizeCertificate(e, type, productTitle);
        }),
      ...internships
        .filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = meta['7877'] || meta['email'];
          const rawStatus = meta['9127'] || meta['status'];
          const isPaid = rawStatus === 'payment_success' || rawStatus === 'Paid';
          return email?.toLowerCase() === userEmail.toLowerCase() && isPaid;
        })
        .map((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const productTitle = meta['7881'] || meta['projectTitle'] || 'Internship Program';
          return normalizeCertificate(e, 'Internship', productTitle);
        })
    ];

    return NextResponse.json({ 
      success: true, 
      certificates: certificates.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()) 
    });
  } catch (error) {
    console.error('Certificates API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

function normalizeCertificate(e: any, type: string, explicitTitle?: string) {
  const meta = e.meta || e.item_meta || {};
  let title = explicitTitle || 'Professional Certificate';
  
  if (!explicitTitle) {
    if (type === 'Academy Program') {
      title = meta['9789'] || meta['mlsd4'] || meta['9770'] || 'Course/Workshop';
    } else if (type === 'Internship') {
      title = meta['7881'] || 'Internship Program';
    }
  }

  // Generate a stable Credential ID
  const credentialId = `NS-2026-${String(e.id).padStart(5, '0')}`;

  return {
    id: e.id,
    title,
    type,
    issueDate: e.created_at,
    credentialId,
    status: 'Issued',
    recipientName: meta['9792'] || meta['7yfjv'] || meta['7876'] || 'Learner'
  };
}
