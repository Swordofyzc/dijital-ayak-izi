const axios = require('axios');

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
      const xposedRes = await axios.get(
        `https://passwords.xposedornot.com/v1/breachedaccount/${email}`,
        { 
          headers: { 'X-Api-Key': leakixKey },
          timeout: 10000
        }
      );
      
      if (xposedRes.data && xposedRes.data.breaches_details) {
        const breachNames = xposedRes.data.breaches_details.split(' ').filter(b => b);
        breaches = breachNames.map(name => ({
          name: name,
          source: 'XposedOrNot',
          date: 'Bilinmiyor',
          description: `${name} veri sızıntısında bulundu`,
          dataClasses: []
        }));
      }
    } catch (err) {
      console.log('XposedOrNot error:', err.message);
    }

    // LeakIX taraması
    let leakixLeaks = [];
    try {
      const leakixRes = await axios.get(
        `https://leakix.net/search?scope=leak&q=${encodeURIComponent(email)}`,
        { 
          headers: { 'api-key': leakixKey },
          timeout: 10000
        }
      );
      
      if (Array.isArray(leakixRes.data)) {
        leakixLeaks = leakixRes.data.map(leak => ({
          name: leak.event_source || 'LeakIX',
          source: 'LeakIX',
          date: leak.time || 'Bilinmiyor',
          description: leak.summary || 'LeakIX veritabanında bulundu',
          dataClasses: leak.leak_data || []
        }));
      }
    } catch (err) {
      console.log('LeakIX error:', err.message);
    }

    // Gravatar
    let gravatar = null;
    try {
      const gravatarRes = await axios.get(
        `https://www.gravatar.com/${email}.json`,
        { timeout: 5000 }
      );
      gravatar = gravatarRes.data;
    } catch (err) {
      console.log('Gravatar error:', err.message);
    }

    const riskScore = Math.min((breaches.length + leakixLeaks.length) * 10, 100);

    return res.status(200).json({
      email,
      breaches: [...(breaches || []), ...(leakixLeaks || [])],
      breachCount: breaches.length,
      leakixLeaks: leakixLeaks || [],
      leakixCount: leakixLeaks.length,
      gravatar,
      riskScore,
      totalBreaches: breaches.length + leakixLeaks.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Tarama sırasında hata oluştu',
      details: error.message 
    });
  }
};
