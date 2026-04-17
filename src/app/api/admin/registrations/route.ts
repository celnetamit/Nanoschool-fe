import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { parseLocalizedNumber } from '@/lib/tax';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const filter = searchParams.get('filter') || 'All';
  const category = searchParams.get('category') || 'All';
  const query = searchParams.get('query') || '';

  try {
    const [courses, internships] = await Promise.all([
      getFormEntries(673),
      getFormEntries(554)
    ]);

    let allRegistrations = [
      ...courses.map(e => normalizeEntry(e, 'General')),
      ...internships.map(e => normalizeEntry(e, 'Internship'))
    ];

    // Filter by category (Type)
    if (category !== 'All') {
      allRegistrations = allRegistrations.filter(r => r.type === category);
    }

    // Filter by type/status
    if (filter === 'Successful') {
      allRegistrations = allRegistrations.filter(r => !r.isLead);
    } else if (filter === 'Leads') {
      allRegistrations = allRegistrations.filter(r => r.isLead);
    }

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      allRegistrations = allRegistrations.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.email.toLowerCase().includes(q) || 
        r.product.toLowerCase().includes(q) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.institution && r.institution.toLowerCase().includes(q))
      );
    }

    // Sort by date descending
    allRegistrations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalCount = allRegistrations.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = allRegistrations.slice(startIndex, startIndex + limit);

    return NextResponse.json({ 
      success: true, 
      registrations: paginatedItems,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Registrations API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

function normalizeEntry(e: any, defaultType: string) {
  const meta = e.meta || e.item_meta || {};
  
  // Unified Priority Mapping
  const name = meta['9792'] || meta['9771'] || meta['7876'] || meta['wly6y'] || meta['u5108'] || meta['fullName'] || 'Unknown';
  const email = meta['9793'] || meta['9772'] || meta['7877'] || meta['7yfjv'] || meta['l0s01'] || meta['email'] || 'N/A';
  const product = meta['mlsd4'] || meta['9789'] || meta['9770'] || meta['7881'] || meta['l9w7q'] || meta['projectTitle'] || 'Generic Registration';
  
  const formattedAmount = String(meta['p30ad'] || meta['9810'] || meta['ijpy8'] || meta['9777'] || '0');
  const amount = parseLocalizedNumber(formattedAmount);
  
  const currency = meta['currency'] || (formattedAmount.includes('₹') ? 'INR' : 'USD');
  const country = meta['9802'] || meta['9776'] || meta['yiu1i'] || 'India';
  const state = meta['9801'] || meta['9775'] || meta['q2ct5'] || '';

  // Metadata Refinement
  const phone = meta['jqnig'] || meta['ycnup'] || meta['7878'] || meta['phone'] || '';
  const institution = meta['2mjze'] || meta['238v0'] || meta['institute'] || meta['university'] || '';
  const level = meta['c5s53'] || meta['1vmh9'] || meta['academicLevel'] || '';
  const major = meta['zsrzh'] || meta['major'] || '';
  const source = meta['4fkgw'] || meta['source'] || '';
  
  // Status Logic
  const rawStatus = meta['2dnu4'] || meta['9127'] || meta['9817'] || meta['9777'] || '';
  let isLead = true;
  if (rawStatus === 'payment_success' || rawStatus === 'Paid' || rawStatus === 'success') {
    isLead = false;
  } else if (amount === 0 && defaultType === 'Internship') {
    isLead = false;
  }
  
  const status = isLead ? 'Unpaid' : 'Paid';

  // Refined Type Inference
  let type = defaultType;
  const subType = meta['vtajg'] || ''; 
  if (subType) type = subType;
  else if (product.toLowerCase().includes('internship')) type = 'Internship';
  else if (product.toLowerCase().includes('workshop')) type = 'Workshop';
  else if (product.toLowerCase().includes('course')) type = 'Course';

  return {
    id: e.id,
    type,
    name,
    email,
    phone,
    institution,
    level,
    major,
    mode: meta['7882'] || meta['mode'] || '',
    duration: meta['7883'] || meta['duration'] || '',
    country,
    state,
    source,
    product,
    status,
    amount,
    formattedAmount,
    currency,
    basePrice: parseFloat(meta['9825'] || '0') || null,
    pricingBreakdown: meta['9832'] ? JSON.parse(meta['9832']) : null,
    date: e.created_at,
    isLead
  };
}
