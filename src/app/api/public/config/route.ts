import { NextResponse } from 'next/server';
import { getSystemConfig } from '@/lib/settings';

export async function GET() {
  try {
    const fullConfig = getSystemConfig();
    
    // Create a redacted public version to prevent leaking sensitive admin logic if any
    const publicConfig = {
      invoice: fullConfig.invoice,
      branding: fullConfig.branding,
      certificate: {
          prefix: fullConfig.certificate.prefix,
          year: fullConfig.certificate.year,
          authorityName: fullConfig.certificate.authorityName,
          authorityTitle: fullConfig.certificate.authorityTitle,
          signatureUrl: fullConfig.certificate.signatureUrl
      }
    };
    
    return NextResponse.json({ success: true, config: publicConfig });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
