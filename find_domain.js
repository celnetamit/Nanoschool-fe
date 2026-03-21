const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim();
  return acc;
}, {});
const auth = Buffer.from(env.WP_USER + ':' + env.WP_PASSWORD).toString('base64');
fetch(env.MENTOR_API_URL + '&page_size=10', { headers: { 'Authorization': 'Basic ' + auth } })
  .then(r => r.json())
  .then(data => {
    const entries = Object.values(data);
    const entry = entries[0];
    console.log("Analyzing keys for 'Primary Domain' or similar domains (AI, Biotech, etc):");
    for (const [key, value] of Object.entries(entry.meta || {})) {
      console.log(`Key ${key}:`, value);
    }
  });
