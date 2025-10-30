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
          headers: { 
            'api-key': leakixKey,
            'User-Agent': 'DijitalAyakIzi/1.0'
          },
          timeout: 10000
        }
      );
      
      if (xposedRes.data && xposedRes.data.breaches_details) {
        const breachNames = xposedRes.data.breaches_details.split(' ').filter(b => b);
        breaches = breachNames.map(name => ({
          name: name.charAt(0).toUpperCase() + name.slice(1), // İlk harf büyük
          source: 'XposedOrNot',
          date: 'Tarih Bilinmiyor',
          description: '', // Açıklama kaldır
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
        leakixLeaks = leakixRes.data.map(leak => {
          // Teknik isimleri temizle ve Türkçeleştir
          let cleanName = leak.event_source || 'Bilinmeyen Kaynak';
          
          // IP/URL temizliği
          if (cleanName.includes('http://') || cleanName.includes('https://')) {
            cleanName = 'Web Servisi Sızıntısı';
          } else if (cleanName.includes('Plugin') || cleanName.includes('Config')) {
            cleanName = 'Sistem Yapılandırma Sızıntısı';
          } else if (cleanName.includes('Git')) {
            cleanName = 'Git Deposu Sızıntısı';
          } else if (cleanName.includes('Database') || cleanName.includes('DB')) {
            cleanName = 'Veritabanı Sızıntısı';
          } else if (cleanName.includes('API')) {
            cleanName = 'API Anahtarı Sızıntısı';
          } else if (cleanName.length > 30) {
            cleanName = 'Veri Sızıntısı';
          }
          
          // Tarih formatı Türkçe
          let formattedDate = 'Tarih Bilinmiyor';
          if (leak.time) {
            try {
              formattedDate = new Date(leak.time).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            } catch (e) {
              formattedDate = leak.time.split('T')[0];
            }
          }
          
          return {
            name: cleanName,
            source: 'LeakIX',
            date: formattedDate,
            description: '', // Açıklama kaldır
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
