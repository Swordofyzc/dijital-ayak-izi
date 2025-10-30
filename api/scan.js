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
      console.log('🔍 XposedOrNot isteği gönderiliyor...');
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
      
      console.log('✅ XposedOrNot response:', xposedRes.data);
      
      if (xposedRes.data && xposedRes.data.breaches_details) {
        const breachNames = xposedRes.data.breaches_details.split(' ').filter(b => b);
        breaches = breachNames.map(name => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          source: 'XposedOrNot',
          date: 'Tarih Bilinmiyor',
          description: `${name} veri ihlalinde e-posta adresiniz bulundu`,
          dataClasses: []
        }));
        console.log('✅ XposedOrNot breaches:', breaches);
      }
    } catch (err) {
      console.log('❌ XposedOrNot error:', err.response?.status, err.message);
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
        leakixLeaks = leakixRes.data.map((leak, index) => {
          // ORİJİNAL ismini koru ama temizle
          let cleanName = leak.event_source || `Veri Sızıntısı #${index + 1}`;
          
          // Sadece gerçekten çok uzun/teknik olanları temizle
          if (cleanName.length > 50) {
            // URL varsa domain'i al
            if (cleanName.includes('http')) {
              try {
                const url = new URL(cleanName);
                cleanName = `${url.hostname} - Sızıntı`;
              } catch {
                cleanName = 'Web Servisi Sızıntısı';
              }
            }
          }
          
          // IP adresi ise temizle
          if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(cleanName)) {
            cleanName = `IP Tabanlı Sızıntı (${cleanName.split(':')[0]})`;
          }
          
          // Tarih
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
          
          // Açıklama - leak.summary varsa ilk 150 karakterini al
          let description = '';
          if (leak.summary && leak.summary.length > 0) {
            description = leak.summary.substring(0, 150);
            if (leak.summary.length > 150) description += '...';
          }
          
          return {
            name: cleanName,
            source: 'LeakIX',
            date: formattedDate,
            description: description,
            dataClasses: leak.leak_data || []
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
