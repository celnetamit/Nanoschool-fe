import { NextResponse } from 'next/server';
import { getFormEntries } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  
  // High-Resolution Mapping based on User-Provided JSON Snippet
  // Name keys: 9792 (New), 9771, 7876 (Old), wly6y, u5108 (Snippet/Header - Low priority)
  const name = meta['9792'] || meta['9771'] || meta['7876'] || meta['wly6y'] || meta['u5108'] || meta['fullName'] || 'Unknown';
  
  // Email keys: 9793 (New), 9772, 7877 (Old), 7yfjv, l0s01 (Snippet - Low priority)
  const email = meta['9793'] || meta['9772'] || meta['7877'] || meta['7yfjv'] || meta['l0s01'] || meta['email'] || 'N/A';
  
  // Product keys: 9789 (Workshop), mlsd4 (Course), 7881 (Internship), l9w7q (Snippet applied for)
  const product = meta['mlsd4'] || meta['9789'] || meta['9770'] || meta['7881'] || meta['l9w7q'] || meta['projectTitle'] || 'Generic Registration';
  
  // Metadata Refinement
  const phone = meta['jqnig'] || meta['ycnup'] || meta['7878'] || meta['phone'] || '';
  const institution = meta['2mjze'] || meta['238v0'] || meta['institute'] || meta['university'] || '';
  const level = meta['c5s53'] || meta['1vmh9'] || meta['academicLevel'] || '';
  const major = meta['zsrzh'] || meta['major'] || '';
  const source = meta['4fkgw'] || meta['source'] || '';
  
  // Location Details
  const country = meta['9802'] || meta['9776'] || meta['yiu1i'] || 'India';
  const state = meta['9801'] || meta['9775'] || meta['q2ct5'] || '';

  // Internship Logistics
  const mode = meta['7882'] || meta['mode'] || '';
  const duration = meta['7883'] || meta['duration'] || '';

  // Status & Logic Evaluation
  const rawStatus = meta['2dnu4'] || meta['9127'] || meta['9817'] || meta['9777'] || '';
  
  // High-Resolution Pricing Logic
  const formattedAmount = String(meta['9810'] || meta['ijpy8'] || meta['p30ad'] || '0');
  const amountRaw = formattedAmount.replace(/[^0-9.]/g, '');
  const amount = parseFloat(amountRaw) || 0;
  
  // Extract currency if possible 
  const currency = formattedAmount.includes('$') ? 'USD' : (formattedAmount.includes('₹') ? 'INR' : 'USD');
  
  // If payment status is explicit success, or if it is a Form 554 application which is inherently active
  // but if the user specifically asked "if data has pricing data then show success or lead as per demand"
  // we follow the payment status if amount > 0.
  let isLead = true;
  if (rawStatus === 'payment_success' || rawStatus === 'Paid') {
    isLead = false;
  } else if (amount === 0 && defaultType === 'Internship') {
    // If it is a free internship application, consider it Successful (not a lead)
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
    mode,
    duration,
    country,
    state,
    source,
    product,
    status,
    amount,
    formattedAmount,
    currency,
    basePrice: parseFloat(meta['9825'] || '0') || null,
    date: e.created_at,
    isLead
  };
}
