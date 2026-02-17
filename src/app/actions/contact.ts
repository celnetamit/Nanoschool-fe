'use server';

export async function submitContactForm(prevState: any, formData: FormData) {
    const CONTACT_URL = 'https://nanoschool.in/contact-us/';

    try {
        // 1. Fetch the contact page to get fresh tokens and cookies
        const initialResponse = await fetch(CONTACT_URL, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!initialResponse.ok) {
            return { success: false, message: 'Failed to initialize contact form connection.' };
        }

        const html = await initialResponse.text();
        const cookies = initialResponse.headers.get('set-cookie') || '';

        // 2. Extract hidden fields and tokens using Regex
        const extractField = (name: string) => {
            const regex = new RegExp(`name="${name}" value="([^"]*)"`);
            const match = html.match(regex);
            return match ? match[1] : '';
        };

        // Specific mapping for dynamic fields
        const frmSubmitEntry = html.match(/name="frm_submit_entry_401" value="([^"]*)"/)?.[1] || '';
        const frmState = html.match(/name="frm_state" value="([^"]*)"/)?.[1] || '';

        if (!frmSubmitEntry || !frmState) {
            // Fallback: try different quote style or spacing if primary regex fails
            console.error('Failed to extract anti-CSRF tokens');
            return { success: false, message: 'Security token extraction failed. Please try again or contact support directly.' };
        }

        // 3. Prepare payload
        const payload = new URLSearchParams();
        payload.append('frm_action', 'create');
        payload.append('form_id', '401');
        payload.append('form_key', '5b4kk'); // Static key observed
        payload.append('item_meta[5996]', formData.get('name') as string); // Name
        payload.append('item_meta[5997]', formData.get('email') as string); // Email
        payload.append('item_meta[5998]', formData.get('phone') as string); // WhatsApp
        payload.append('item_meta[5999]', formData.get('message') as string); // Message

        // Hidden/Default fields
        payload.append('item_meta[9122]', 'Open');
        payload.append('item_meta[7883]', 'Contact us_17242');
        payload.append('item_key', '');
        payload.append('frm_submit_entry_401', frmSubmitEntry);
        payload.append('frm_state', frmState);
        payload.append('_wp_http_referer', '/contact-us/');

        // 4. Submit to WordPress
        const submitResponse = await fetch(CONTACT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': CONTACT_URL,
                'Origin': 'https://nanoschool.in'
            },
            body: payload.toString()
        });

        const responseHtml = await submitResponse.text();

        // 5. Verify success
        // Formidable usually redirects or shows a success message.
        // We check for success message "Your message was successfully sent" or similar, 
        // OR if the response URL has changed (if using fetch in browser, but here likely 200 OK with content).
        // Or check for "frm_message" div.

        if (responseHtml.includes('frm_message') || responseHtml.includes('successfully sent') || responseHtml.includes('Thank you')) {
            return { success: true, message: 'Thank you! Your message has been sent successfully.' };
        } else {
            // Log failure details for debugging (in production, log to monitoring service)
            console.error('Submission seemed to fail. HTML preview:', responseHtml.substring(0, 500));
            return { success: false, message: 'Submission failed. Please try contacting us directly via email.' };
        }

    } catch (error) {
        console.error('Contact form error:', error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
}
