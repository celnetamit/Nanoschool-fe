import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSystemConfig, saveSystemConfig, SystemConfig } from '@/lib/settings';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const config = getSystemConfig();
  return NextResponse.json({ success: true, config });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const newConfig: SystemConfig = await request.json();
    
    // Basic validation could be added here
    const success = saveSystemConfig(newConfig);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Configuration updated successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save configuration' }, { status: 500 });
    }
  } catch (error) {
    console.error('Config API POST error:', error);
    return NextResponse.json({ success: false, error: 'Invalid configuration data' }, { status: 400 });
  }
}
