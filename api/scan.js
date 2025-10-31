const axios = require('axios');

console.log('🚀 API scan.js yüklendi');

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

    // XposedOrNot taraması
    console.log('=== XPOSEDORNOT BAŞLIYOR ===');
    let breaches = [];
    try {
      const xposedRes = await axios.get(
        `https://passwords.xposedornot.com/v1/breachedaccount/${email}`
      );
      
      if (xposedRes.data && xposedRes.data.breaches_details) {
        const breachNames = xposedRes.data.breaches_details.split(' ').filter(b => b);
        breaches = breachNames.map(name => ({
          name: name,
          source: 'XposedOrNot',
          date: 'Tarih Bilinmiyor',
          description: '',
          dataClasses: []
        }));
      }
    } catch (err) {
      console.log('=== XPOSEDORNOT CATCH BLOĞU ===');
      console.log('❌ Error type:', err.constructor.name);
      console.log('❌ Error message:', err.message);
      console.log('❌ Error stack:', err.stack);
      if (err.response) {
        console.log('❌ Response status:', err.response.status);
        console.log('❌ Response data:', err.response.data);
      }
    }

    // LeakIX kaldırıldı - teknik açık sunucular, son kullanıcıya uygun değil

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

    return res.status(200).json({
      email,
      breaches: breaches,
      breachCount: breaches.length,
      leakixLeaks: [],
      leakixCount: 0,
      gravatar,
      riskScore: Math.min(breaches.length * 20, 100),
      totalBreaches: breaches.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Tarama sırasında hata oluştu',
      details: error.message 
    });
  }
};
