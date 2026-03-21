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
    const approved = entries.find(e => JSON.stringify(e).includes('Approved'));
    if (approved) {
      console.log('Found an approved entry. Keys with "Approved":');
      for (const [key, value] of Object.entries(approved.meta || {})) {
        if (typeof value === 'string' && value.includes('Approved')) {
          console.log(`meta['${key}'] = ${value}`);
        } else if (Array.isArray(value)) {
            if (value.some(v => typeof v === 'string' && v.includes('Approved'))) {
                console.log(`meta['${key}'] =`, value);
            }
        }
      }
    } else {
      console.log('No entry found with "Approved"');
    }
  });
