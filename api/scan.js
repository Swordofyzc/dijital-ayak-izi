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

    const leakixKey = process.env.LEAKIX_API_KEY;

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

    // === LEAKİX BAŞLIYOR ===
    let leakixLeaks = [];
    try {
      const leakixRes = await axios.get(
        `https://leakix.net/search?scope=leak&q=${encodeURIComponent(email)}`,
        { 
          headers: { 'api-key': process.env.LEAKIX_API_KEY },
          timeout: 10000
        }
      );
      
      if (Array.isArray(leakixRes.data)) {
        // SADECE İLK 5 SONUCU AL
        const limitedData = leakixRes.data.slice(0, 5);
        
        // SADECE ANLAMLI OLANLARI FİLTRELE
        leakixLeaks = limitedData
          .filter(leak => {
            const hasValidSource = leak.event_source && 
                                   leak.event_source.length > 3 &&
                                   !leak.event_source.includes('Apache Status') &&
                                   !leak.event_source.includes('Server Status');
            return hasValidSource;
          })
          .map(leak => {
            let cleanName = leak.event_source || 'Veri Sızıntısı';
            
            if (cleanName.includes('Git')) cleanName = 'Git Deposu Sızıntısı';
            if (cleanName.includes('Config') || cleanName.includes('Plugin')) cleanName = 'Yapılandırma Sızıntısı';
            
            if (cleanName.includes('http')) {
              try {
                const url = new URL(cleanName);
                cleanName = url.hostname;
              } catch {
                cleanName = 'Web Sızıntısı';
              }
            }
            
            let formattedDate = 'Tarih Bilinmiyor';
            if (leak.time) {
              try {
                formattedDate = new Date(leak.time).toLocaleDateString('tr-TR');
              } catch {
                formattedDate = leak.time.split('T')[0];
              }
            }
            
            return {
              name: cleanName,
              source: 'LeakIX',
              date: formattedDate,
              description: '',
              dataClasses: []
            };
          });
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
