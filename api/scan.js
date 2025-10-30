const https = require('https');

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email gerekli' });
    }

    const leakixKey = process.env.LEAKIX_API_KEY;

    // XposedOrNot taraması
    let breaches = [];
    try {
      const xposedUrl = `https://passwords.xposedornot.com/v1/breachedaccount/${email}`;
      const xposedRes = await httpsRequest(xposedUrl, {
        method: 'GET',
        headers: { 'X-Api-Key': leakixKey }
      });
      
      if (xposedRes.status === 200 && xposedRes.data.breaches_details) {
        breaches = xposedRes.data.breaches_details.split(' ');
      }
    } catch (err) {
      console.log('XposedOrNot error:', err.message);
    }

    // LeakIX taraması
    let leakixLeaks = [];
    try {
      const leakixUrl = `https://leakix.net/search?scope=leak&q=${email}`;
      const leakixRes = await httpsRequest(leakixUrl, {
        method: 'GET',
        headers: { 'api-key': leakixKey }
      });
      
      if (leakixRes.status === 200 && Array.isArray(leakixRes.data)) {
        leakixLeaks = leakixRes.data;
      }
    } catch (err) {
      console.log('LeakIX error:', err.message);
    }

    // Gravatar
    let gravatar = null;
    try {
      const gravatarUrl = `https://www.gravatar.com/${email}.json`;
      const gravatarRes = await httpsRequest(gravatarUrl, { method: 'GET' });
      if (gravatarRes.status === 200) {
        gravatar = gravatarRes.data;
      }
    } catch (err) {
      console.log('Gravatar error:', err.message);
    }

    const riskScore = Math.min((breaches.length + leakixLeaks.length) * 10, 100);

    return res.status(200).json({
      email,
      breaches: breaches || [],
      breachCount: (breaches || []).length,
      leakixLeaks: leakixLeaks || [],
      leakixCount: (leakixLeaks || []).length,
      gravatar: gravatar || null,
      riskScore
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Tarama sırasında hata oluştu',
      details: error.message 
    });
  }
};
