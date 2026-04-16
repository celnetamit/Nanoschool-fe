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
    const [registrations673, registrations672, internships, eventEndDates] = await Promise.all([
       getFormEntries(673),
       getFormEntries(672),
       getFormEntries(554),
       getEventEndDates()
    ]);

    const today = new Date();

    // Normalizer to help match titles with minor variations
    const slugify = (str: string) => String(str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    // Normalize event keys for fuzzy matching
    const normalizedEventDates: Record<string, Date> = {};
    Object.entries(eventEndDates).forEach(([title, date]) => {
      normalizedEventDates[slugify(title)] = date;
    });

    const processEntries = (entries: any[], defaultType: string) => {
      return entries.filter((e: any) => {
        const meta = e.meta || e.item_meta || {};
        const email = (meta['9793'] || meta['9772'] || meta['7yfjv'] || '').toLowerCase();
        
        // Success criteria check
        const rawStatus = (meta['9817'] || meta['2dnu4'] || meta['9777'] || '').toLowerCase();
        const isPaid = rawStatus === 'payment_success' || rawStatus === 'success' || rawStatus === 'paid';
        
        if (!isPaid || email !== userEmail.toLowerCase()) return false;

        // Chronological Gate check
        const productTitle = String(meta['9789'] || meta['9770'] || meta['mlsd4'] || '').trim();
        const slug = slugify(productTitle);
        const endDate = normalizedEventDates[slug];
        
        if (endDate) {
          return today > endDate;
        }

        // FALLBACK: If event is not in Form 40 schedule, allow visibility if entry > 14 days old
        const entryDate = new Date(e.created_at);
        const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 14;
      }).map((e: any) => {
        const meta = e.meta || e.item_meta || {};
        const productTitle = meta['9789'] || meta['9770'] || meta['mlsd4'] || defaultType;
        return normalizeCertificate(e, defaultType, productTitle);
      });
    };

    const certificates = [
      ...processEntries(registrations673, 'Academy Program'),
      ...processEntries(registrations672, 'Workshop'),
      ...internships
        .filter((e: any) => {
          const meta = e.meta || e.item_meta || {};
          const email = (meta['7877'] || meta['email'] || '').toLowerCase();
          const rawStatus = (meta['9127'] || meta['status'] || '').toLowerCase();
          const isPaid = rawStatus === 'payment_success' || rawStatus === 'paid' || rawStatus === 'completed';
          
          if (!isPaid || email !== userEmail.toLowerCase()) return false;

          const productTitle = String(meta['7881'] || meta['projectTitle'] || '').trim();
          const slug = slugify(productTitle);
          const endDate = normalizedEventDates[slug];
          
          // For internships, we are more lenient if not found in schedule
          if (endDate) return today > endDate;
          
          const entryDate = new Date(e.created_at);
          const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays >= 28; // Longer fallback for internships
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

  // Robust Name detection for the certificate
  const recipientName = meta['9792'] || meta['9771'] || meta['7876'] || meta['wly6y'] || 'Learner';

  return {
    id: e.id,
    title,
    type,
    issueDate: e.created_at,
    credentialId,
    status: 'Issued',
    recipientName
  };
}
