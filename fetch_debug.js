async function fetchProduct() {
    try {
        const response = await fetch('https://nanoschool.in/wp-json/wp/v2/product?per_page=1&_embed', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error('Failed:', response.status, response.statusText);
            return;
        }

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProduct();
