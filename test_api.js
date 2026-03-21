require('dotenv').config();
const fetch = require('node-fetch'); // If not available, use dynamic import or native fetch (Node 18+)

async function test() {
  const url = process.env.MENTOR_API_URL + '&page_size=500';
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASSWORD;
  const authString = Buffer.from(`${user}:${pass}`).toString('base64');
  
  const res = await fetch(url, { headers: { 'Authorization': `Basic ${authString}` } });
  const data = await res.json();
  const entries = Object.values(data);
  console.log('Total entries returned:', entries.length);
  console.log('X-WP-Total header:', res.headers.get('x-wp-total'));
}
test();
