import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getSystemConfig } from '@/lib/settings';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Fetch certificate-eligible entries from Form 40 (Events)
 * This allows us to check for end dates.
 */
async function getEventEndDates(): Promise<Record<string, Date>> {
  const url = process.env.UPCOMING_EVENTS_API_URL;
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASSWORD;

  if (!url || !user || !pass) return {};

  try {
    const authString = Buffer.from(`${user}:${pass}`).toString('base64');
    const response = await fetch(`${url}&page_size=300`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });

    if (!response.ok) return {};

    const data = await response.json();
    const entries = Array.isArray(data) ? data : Object.values(data);
    const dateMap: Record<string, Date> = {};

    entries.forEach((entry: any) => {
      const meta = entry.meta || {};
      const title = String(meta['w1zd'] || '').trim().toLowerCase();
      const endDateStr = meta['9p93w']; // End Date Field

      if (title && endDateStr) {
        // Parse "MM/DD/YYYY"
        const parts = String(endDateStr).split('/');
        if (parts.length === 3) {
          const m = parseInt(parts[0], 10);
          const d = parseInt(parts[1], 10);
          const y = parseInt(parts[2], 10);
          const fullYear = y < 100 ? 2000 + y : y;
          const date = new Date(fullYear, m - 1, d, 23, 59, 59);
          if (!isNaN(date.getTime())) {
            dateMap[title] = date;
          }
        }
      }
    });

    return dateMap;
  } catch (e) {
    console.error('Error fetching event end dates:', e);
    return {};
  }
}

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
    const [registrations673, internships, eventEndDates] = await Promise.all([
       getFormEntries(673),
       getFormEntries(554),
       getEventEndDates()
    ]);

    const today = new Date();

    // Filter and normalize entries for the current user
    const certificates = [
      ...registrations673
        .filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = meta['9793'] || meta['7yfjv'] || meta['9772'];
          const rawStatus = meta['9817'] || meta['2dnu4'] || meta['9777'];
          const productTitle = String(meta['9789'] || meta['mlsd4'] || meta['9770'] || '').trim().toLowerCase();
          
          const isPaid = rawStatus === 'payment_success' || rawStatus === 'Paid';
          
          // STRICT RULE: Must be paid AND program must have ended
          const endDate = eventEndDates[productTitle];
          const hasEnded = endDate ? today > endDate : false;

          return email?.toLowerCase() === userEmail.toLowerCase() && isPaid && hasEnded;
        })
        .map((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const productTitle = meta['9789'] || meta['mlsd4'] || meta['9770'] || 'Academy Program';
          return normalizeCertificate(e, 'Academy Program', productTitle);
        }),
      ...internships
        .filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = meta['7877'] || meta['email'];
          const rawStatus = meta['9127'] || meta['status'];
          const productTitle = String(meta['7881'] || meta['projectTitle'] || '').trim().toLowerCase();
          
          const isPaid = rawStatus === 'payment_success' || rawStatus === 'Paid' || rawStatus === 'Completed';
          
          // Internship date check
          const endDate = eventEndDates[productTitle];
          const hasEnded = endDate ? today > endDate : true; // Default true for internships if not in Form 40

          return email?.toLowerCase() === userEmail.toLowerCase() && isPaid && hasEnded;
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
  
  const config = getSystemConfig();
  const prefix = config.certificate.prefix || 'NS';
  const year = config.certificate.year || '2026';
  const credentialId = `${prefix}-${year}-${String(e.id).padStart(5, '0')}`;

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
