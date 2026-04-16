import { prisma } from '../lib/prisma';
import { sendEnrollmentEmail, sendWhatsAppMessage } from '../services/notification.service';

export async function triggerBackgroundNotification(data: { 
  email: string, 
  name: string, 
  phone: string, 
  courseName: string, 
  enrollmentId?: string 
}) {
  const { email, name, phone, courseName, enrollmentId } = data;

  try {
    // 1. Attempt to link to an existing user (Optional)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true }
    });

    const userId = user?.id || null;

    // 2. Prepare parallel promises for dispatch
    const promises = [];

    console.log(`[Notification Engine] Starting dispatch for ${email} | Phone: ${phone}`);

    // Always use the form-provided email and name
    promises.push(
      sendEnrollmentEmail(email, name, courseName)
        .then((res: any) => logNotification(userId, enrollmentId, 'EMAIL', 'SENT', email, res.messageId))
        .catch((err: any) => logNotification(userId, enrollmentId, 'EMAIL', 'FAILED', email, null, err.message))
    );

    if (phone) {
      promises.push(
        sendWhatsAppMessage(phone, name, courseName)
          .then((res: any) => logNotification(userId, enrollmentId, 'WHATSAPP', 'SENT', phone, res.sid))
          .catch((err: any) => logNotification(userId, enrollmentId, 'WHATSAPP', 'FAILED', phone, null, err.message))
      );
    }

    // 3. Execute all without blocking the main event loop
    await Promise.allSettled(promises);
    console.log(`[Notification Engine] Completed dispatch task.`);

  } catch (error) {
    console.error(`[Notification Engine] Critical failure during execution`, error);
  }
}

// Helper to write to database
async function logNotification(userId: string | null, enrollmentId: string | undefined, type: string, status: string, target: string, providerId?: string | null, error?: string) {
  try {
    await prisma.notificationLog.create({
      data: { 
        userId, 
        enrollmentId: enrollmentId || null, 
        type, 
        status, 
        target, 
        providerId: providerId || null, 
        error 
      }
    });
  } catch (dbError) {
    console.error("[Notification Engine] Failed to write to notification log", dbError);
  }
}
