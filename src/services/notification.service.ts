import nodemailer from 'nodemailer';
import * as aws from "@aws-sdk/client-ses";

/**
 * AWS SES Notification Service
 * This service handles email delivery exclusively via AWS SES.
 * SMTP and WhatsApp are disabled per current business rules.
 */

// --- AWS SES CONFIGURATION ---
let transporter: nodemailer.Transporter | null = null;
const isAwsConfigured = !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

if (isAwsConfigured) {
  try {
    const ses = new aws.SESClient({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });
    console.log('[Notification] AWS SES Transporter initialized successfully');
  } catch (err) {
    console.error('[Notification] AWS SES Initialization failed:', err);
  }
} else {
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      console.error('[CRITICAL] AWS SES credentials MISSING in Production. Notifications will fail back to simulation.');
    } else {
      console.warn('[Notification] AWS SES credentials not found. System running in Simulated/Dev Mode.');
    }
}

export async function sendEnrollmentEmail(email: string, name: string, courseName: string) {
  if (!transporter) {
    const isProd = process.env.NODE_ENV === 'production';
    console.log(`${isProd ? '[PROD SIMULATION]' : '[DEV MODE]'} Simulated Email sent to ${email} for course ${courseName}`);
    return { messageId: 'simulated_email_id_123' };
  }

  const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://courses.nanoschool.in'}/dashboard/payments`;
  
  try {
    const info = await transporter.sendMail({
      from: process.env.AWS_SES_FROM_ADDRESS || process.env.EMAIL_FROM_ADDRESS || '"NanoSchool Academy" <notifications@nanoschool.in>',
      to: email,
      subject: `Enrollment Confirmed: ${courseName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Enrollment Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <!-- Header with Gradient -->
            <tr>
              <td align="center" style="padding: 40px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color: rgba(255, 255, 255, 0.2); padding: 12px 24px; border-radius: 100px; backdrop-filter: blur(10px);">
                      <span style="color: #ffffff; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">NanoSchool</span>
                    </td>
                  </tr>
                </table>
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; margin: 24px 0 8px 0; letter-spacing: -1px;">Registration Confirmed</h1>
                <p style="color: #bfdbfe; font-size: 16px; margin: 0;">Welcome to the future of learning</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px;">
                <p style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 16px;">Hi ${name},</p>
                <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">Great news! Your enrollment for <strong>${courseName}</strong> has been successfully processed and verified.</p>
                
                <!-- Highlight Card -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                  <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Unlocked Features</h4>
                  <ul style="margin: 0; padding: 0; list-style: none;">
                    <li style="margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #334155; display: flex; align-items: center;">
                      <span style="color: #10b981; margin-right: 8px;">✓</span> Full access to course materials
                    </li>
                    <li style="margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #334155; display: flex; align-items: center;">
                      <span style="color: #10b981; margin-right: 8px;">✓</span> Live sessions & workshop recordings
                    </li>
                    <li style="font-size: 14px; font-weight: 600; color: #334155; display: flex; align-items: center;">
                      <span style="color: #10b981; margin-right: 8px;">✓</span> Community forum & mentor support
                    </li>
                  </ul>
                </div>

                <!-- Action Button -->
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 18px 36px; border-radius: 12px; font-size: 16px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); transition: all 0.2s;">
                    Access Your Dashboard
                  </a>
                  <p style="margin-top: 16px; font-size: 13px; color: #94a3b8;">Click the button above to view your registration</p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <div style="border-top: 1px solid #f1f5f9; padding-top: 30px; text-align: center;">
                  <p style="font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 4px;">Need help with your enrollment?</p>
                  <p style="font-size: 13px; color: #94a3b8; margin: 0;">Reply to this email or visit our <a href="${process.env.NEXTAUTH_URL}/support" style="color: #2563eb; text-decoration: none; font-weight: 600;">Support Center</a>.</p>
                  
                  <div style="margin-top: 32px;">
                    <p style="font-size: 12px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px;">NanoSchool Academy</p>
                    <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">&copy; 2026 NanoSchool. All rights reserved.</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    return info;
  } catch (error) {
    console.error('[Notification] Failed to send email via SES:', error);
    throw error;
  }
}

export async function sendWhatsAppMessage(phone: string, _name: string, _courseName: string) {
  console.log(`[Notification] WhatsApp message skipped for ${phone} (WhatsApp disabled)`);
  return { sid: 'skipped_disabled', status: 'skipped' };
}
