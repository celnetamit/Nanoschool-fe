import { NextResponse } from 'next/server';
import { getWooCommerceProducts } from '@/lib/wordpress';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('limit') || '40');
  const categoryId = parseInt(searchParams.get('category') || '0');

  try {
    const products = await getWooCommerceProducts({ perPage, page, categoryId });
    
    // For WooCommerce API, total pages/items are in headers, 
    // but getWooCommerceProducts currently doesn't return them.
    // We'll return the list and assume caller knows how to paginate or we can wrap it if needed.
    
    return NextResponse.json({ 
      success: true, 
      products,
      pagination: {
        page,
        perPage,
        // Since getWooCommerceProducts hides total headers, we'll return a simple success
        hasMore: products.length === perPage
      }
    });
  } catch (error) {
    console.error('Admin Products API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
