'use server';

import nodemailer from 'nodemailer';

export async function sendContactEmail(prevState: any, formData: FormData) {
    try {
        // Extract dynamic fields based on Formidable Forms keys or standard names
        const entries = Array.from(formData.entries());
        const data: Record<string, string> = {};

        // Simplistic mapping for common fields, but we'll include all data in the email body
        let name = '';
        let email = '';
        let message = '';

        for (const [key, value] of entries) {
            if (typeof value === 'string') {
                data[key] = value;
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('name') && !name) name = value;
                if (lowerKey.includes('email') && !email) email = value;
                if (lowerKey.includes('message') && !message) message = value;
            }
        }

        // specific field mapping from Formidable Forms if predictable (optional optimization)
        // Field keys from API: xibtn (Name), 1a7r2 (Email), 7wwe1 (Phone), t5su1 (Message)
        if (!name) name = (formData.get('xibtn') || formData.get('item_meta[5996]') || 'Anonymous') as string;
        if (!email) email = (formData.get('1a7r2') || formData.get('item_meta[5997]') || 'no-reply@example.com') as string;
        if (!message) message = (formData.get('t5su1') || formData.get('item_meta[5999]') || 'No message provided') as string;


        // Configure transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Build Email Body from all form data
        let htmlBody = `<h3>New Contact Form Submission</h3>`;
        for (const [key, value] of Object.entries(data)) {
            // Skip next.js internal fields
            if (key.startsWith('$ACTION')) continue;
            htmlBody += `<p><strong>${key}:</strong> ${value}</p>`;
        }

        // Email content
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: process.env.SMTP_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: JSON.stringify(data, null, 2),
            html: htmlBody,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return { success: true, message: 'Thank you! Your message has been sent successfully.' };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, message: 'Failed to send message. Please try again later or contact us directly.' };
    }
}
