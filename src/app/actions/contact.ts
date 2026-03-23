'use server';

/**
 * Server action to submit contact form data to the Formidable Forms REST API.
 */
export async function submitContactForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const queryFor = formData.get('queryFor') as string;
    const message = formData.get('message') as string;
    const page = formData.get('page') as string;

    // Simple server-side validation
    if (!name || !email || !message) {
        return { success: false, message: 'Please fill in all required fields.' };
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    const apiUrl = 'https://nanoschool.in/wp-json/frm/v2/entries';
    const username = process.env.WP_USER;
    const password = process.env.WP_PASSWORD;

    if (!username || !password) {
        console.error('WordPress credentials missing in environment variables.');
        return { success: false, message: 'Server configuration error. Please try again later.' };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
            },
            body: JSON.stringify({
                form_id: 401,
                item_meta: {
                    '5996': name,     // Name (xibtn)
                    '5997': email,    // Email (1a7r2)
                    '5998': phone,    // Contact Number (7wwe1)
                    '8271': queryFor, // Query For (t8lp9)
                    '5999': message,   // Message (t5su1)
                    '7883': page,      // Page URL (dynamic)
                    '9122': 'Hold',    // Status (3dv68) - Default 'Hold'
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Formidable API error:', result);
            
            // Handle error messages which can be objects in Formidable API
            let errorMessage = 'Failed to submit the form. Please try again.';
            if (typeof result.message === 'string') {
                errorMessage = result.message;
            } else if (typeof result.message === 'object' && result.message !== null) {
                // If it's an object of field errors, just take the first one or join them
                errorMessage = Object.values(result.message).join(' ');
            }

            return { 
                success: false, 
                message: errorMessage 
            };
        }

        return { 
            success: true, 
            message: 'Thank you! Your message has been received and we will get back to you shortly.' 
        };
    } catch (error) {
        console.error('Submission error:', error);
        return { 
            success: false, 
            message: 'An unexpected error occurred. Please try again later.' 
        };
    }
}
