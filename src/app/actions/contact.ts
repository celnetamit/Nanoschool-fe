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

        // 2. Extract ALL hidden fields and tokens
        // We will extract ALL hidden inputs to ensure we don't miss any dynamic security tokens or nonce fields
        const hiddenFields = new Map<string, string>();

        // Regex to capture the name and value of any input type="hidden"
        // Handling various attribute orders and quoting styles
        // We'll iterate over all input tags
        const inputTagRegex = /<input[^>]+>/gi;
        let match;

        while ((match = inputTagRegex.exec(html)) !== null) {
            const tag = match[0];
            // Check if it's a hidden input
            if (/\stype=["']?hidden["']?/i.test(tag)) {
                const nameMatch = tag.match(/name=["']([^"']+)["']/);
                const valueMatch = tag.match(/value=["']([^"']*)["']/);

                if (nameMatch && valueMatch) {
                    hiddenFields.set(nameMatch[1], valueMatch[1]);
                }
            }
        }

        // Specific checks for key fields to ensure we actually got the form
        const frmSubmitEntry = hiddenFields.get('frm_submit_entry_401');
        const frmState = hiddenFields.get('frm_state');

        if (!frmSubmitEntry || !frmState) {
            console.error('Failed to extract anti-CSRF tokens. Hidden fields found:', Object.fromEntries(hiddenFields));
            return { success: false, message: 'Security token extraction failed. Please try again later.' };
        }

        // 3. Prepare payload
        const payload = new URLSearchParams();

        // Add all extracted hidden fields first (covers form_id, form_key, tokens, nonces, etc.)
        hiddenFields.forEach((value, key) => {
            payload.append(key, value);
        });

        // Overwrite/Add specific fields for the user input
        // Ensure action is set (sometimes it's hidden, sometimes not)
        if (!payload.has('frm_action')) payload.set('frm_action', 'create');

        payload.set('item_meta[5996]', formData.get('name') as string); // Name
        payload.set('item_meta[5997]', formData.get('email') as string); // Email
        payload.set('item_meta[5998]', formData.get('phone') as string); // WhatsApp
        payload.set('item_meta[5999]', formData.get('message') as string); // Message

        // Ensure referer is correct as WP often checks this
        payload.set('_wp_http_referer', '/contact-us/');

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
        console.log('Submission Response Status:', submitResponse.status);

        if (responseHtml.includes('frm_message') || responseHtml.includes('successfully sent') || responseHtml.includes('Thank you')) {
            return { success: true, message: 'Thank you! Your message has been sent successfully.' };
        } else {
            // Log failure details for debugging
            console.error('Submission seemed to fail. HTML preview:', responseHtml.substring(0, 500));
            if (responseHtml.includes('frm_error_style')) {
                console.error('Formidable Validation Errors detected.');
            }
            return { success: false, message: 'Submission failed. Please try contacting us directly via email.' };
        }

    } catch (error) {
        console.error('Contact form error:', error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
}
