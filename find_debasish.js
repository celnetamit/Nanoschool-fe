const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim();
  return acc;
}, {});
const auth = Buffer.from(env.WP_USER + ':' + env.WP_PASSWORD).toString('base64');
fetch(env.MENTOR_API_URL + '&page_size=50', { headers: { 'Authorization': 'Basic ' + auth } })
  .then(r => r.json())
  .then(data => {
    const entries = Object.values(data);
    const debasish = entries.find(e => e.meta && e.meta.qrtsy && e.meta.qrtsy.includes('DEBASISH'));
    if (debasish) {
      console.log("Found DEBASISH:");
      for (const [key, value] of Object.entries(debasish.meta || {})) {
        console.log(`Key ${key}:`, value);
      }
    } else {
      console.log('Not found');
    }
  });
