/**
 * Vercel Serverless Function
 * Dijital Ayak İzi Tarayıcı API
 */

import crypto from 'crypto'

// XposedOrNot Scan
async function scanXposedOrNot(email) {
  try {
    console.log('\n━━━━━━ XposedOrNot Taraması ━━━━━━')
    console.log('📧 Email:', email)

    const response = await fetch(
      `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DigitalFootprint/1.0'
        }
      }
    )

    console.log('📊 Response Status:', response.status)

    if (response.status === 404) {
      console.log('✅ XposedOrNot: Temiz')
      return []
    }

    if (!response.ok) {
      console.error('❌ XposedOrNot hatası:', response.status)
      return []
    }

    const data = await response.json()
    
    console.log('\n━━━ RAW RESPONSE ━━━')
    console.log('Full Data:', JSON.stringify(data, null, 2))
    console.log('Breaches:', data.breaches)
    console.log('Breaches Type:', typeof data.breaches)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━\n')

    if (data.status !== 'success') {
      console.log('❌ Status:', data.status)
      return []
    }

    if (!data.breaches) {
      console.log('❌ Breaches yok')
      return []
    }

    // Response format: breaches = nested array veya string
    let breachNames = []
    
    if (typeof data.breaches === 'string') {
      // Space ile ayrılmış string!
      breachNames = data.breaches.split(' ').filter(b => b.trim())
      console.log('✅ String split edildi (space):', breachNames)
    } else if (Array.isArray(data.breaches)) {
      // Array kontrolü - nested array mı değil mi?
      if (data.breaches.length > 0 && Array.isArray(data.breaches[0])) {
        // NESTED ARRAY! İç array'i al
        breachNames = data.breaches[0]
        console.log('✅ Nested Array (İç array alındı):', breachNames)
      } else {
        // Normal array
        breachNames = data.breaches
        console.log('✅ Array:', breachNames)
      }
    }

    const breaches = breachNames.map(name => ({
      name: name.trim(),
      source: 'XposedOrNot',
      email: data.email,
      severity: 'high',
      verified: true,
      breachDate: null,
      description: `${name.trim()} platformunda veri sızıntısı tespit edildi`,
      dataClasses: ['E-posta', 'Şifre']
    }))

    console.log('✅ XposedOrNot:', breaches.length, 'breach bulundu')
    breaches.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.name}`)
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━\n')

    return breaches

  } catch (error) {
    console.error('\n❌ XposedOrNot HATASI ❌')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return []
  }
}

// LeakIX İsim Çevirisi (Kullanıcı Dostu Türkçe)
function translateLeakIXName(technicalName) {
  const translations = {
    // Git & Version Control
    'GitConfigHttpPlugin': 'Git Yapılandırma Dosyası',
    'GitPlugin': 'Git Deposu',
    'GitlabPlugin': 'GitLab Deposu',
    'GithubPlugin': 'GitHub Deposu',
    
    // Web Servers
    'ApacheStatusPlugin': 'Apache Web Sunucusu',
    'NginxPlugin': 'Nginx Web Sunucusu',
    'TomcatPlugin': 'Tomcat Uygulama Sunucusu',
    
    // Monitoring & Management
    'CheckMkPlugin': 'Sistem İzleme Paneli',
    'PrometheusPlugin': 'Prometheus İzleme Sistemi',
    'GrafanaPlugin': 'Grafana İzleme Paneli',
    'JenkinsPlugin': 'Jenkins Otomasyon Sunucusu',
    
    // Databases
    'MongoDBPlugin': 'MongoDB Veritabanı',
    'RedisPlugin': 'Redis Önbellek Sunucusu',
    'ElasticsearchPlugin': 'Elasticsearch Arama Motoru',
    'PostgresPlugin': 'PostgreSQL Veritabanı',
    'MySQLPlugin': 'MySQL Veritabanı',
    'CouchDBPlugin': 'CouchDB Veritabanı',
    'CassandraPlugin': 'Cassandra Veritabanı',
    
    // APIs & Services
    'DockerRegistryPlugin': 'Docker Container Registry',
    'KubernetesPlugin': 'Kubernetes Yönetim Paneli',
    'SwaggerPlugin': 'API Dokümantasyon Sayfası',
    'PhpInfoPlugin': 'PHP Bilgi Sayfası',
    
    // Other
    'FtpPlugin': 'FTP Dosya Sunucusu',
    'SmbPlugin': 'Windows Dosya Paylaşımı',
    'RdpPlugin': 'Uzak Masaüstü Bağlantısı'
  }
  
  return translations[technicalName] || technicalName
}

// LeakIX Açıklama Oluştur
function getLeakIXDescription(technicalName, translatedName) {
  const descriptions = {
    'GitConfigHttpPlugin': 'Git yapılandırma dosyası internete açık. Hassas bilgiler (şifreler, API anahtarları) sızabilir.',
    'ApacheStatusPlugin': 'Apache sunucu durum sayfası herkese açık. Sistem bilgileri ifşa olmuş.',
    'CheckMkPlugin': 'Sistem izleme paneli korumasız. Sunucu detayları ve yapılandırma bilgileri erişilebilir durumda.',
    'MongoDBPlugin': 'MongoDB veritabanı şifresiz ve internete açık. Tüm veriler risk altında.',
    'RedisPlugin': 'Redis sunucusu korumasız. Önbellek verileri ve oturum bilgileri erişilebilir.',
    'ElasticsearchPlugin': 'Elasticsearch arama motoru açık. İndekslenmiş tüm veriler ifşa olmuş.',
    'DockerRegistryPlugin': 'Docker container registry korumasız. Container imajları ve kaynak kodları erişilebilir.',
    'KubernetesPlugin': 'Kubernetes yönetim paneli açık. Tüm cluster yönetimi risk altında.'
  }
  
  return descriptions[technicalName] || `${translatedName} internete açık ve korumasız. Hassas sistem bilgileri ifşa olmuş durumda.`
}

// LeakIX Scan
async function scanLeakIX(email) {
  try {
    console.log('\n━━━━━━ LeakIX Taraması ━━━━━━')
    console.log('📧 Email:', email)
    
    const apiKey = process.env.LEAKIX_API_KEY
    console.log('🔑 API Key:', apiKey ? '✅ Var' : '❌ Yok')

    const response = await fetch(
      `https://leakix.net/search?scope=leak&q=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Accept': 'application/json'
        }
      }
    )

    console.log('📊 Response Status:', response.status)

    if (!response.ok) {
      console.error('❌ LeakIX hatası:', response.status)
      return []
    }

    const data = await response.json()
    console.log('📦 Response Data Type:', Array.isArray(data) ? 'Array' : typeof data)
    console.log('📏 Data Length:', Array.isArray(data) ? data.length : 'N/A')

    const breaches = []

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const technicalName = item.event_source || item.leak_name || 'Bilinmeyen Veritabanı'
        const translatedName = translateLeakIXName(technicalName)
        const description = getLeakIXDescription(technicalName, translatedName)
        
        breaches.push({
          name: translatedName,
          technicalName: technicalName, // Orijinal ismi de sakla
          date: item.time || item.event_time || null,
          source: 'LeakIX',
          severity: item.severity || 'high', // LeakIX bulguları genelde high risk
          description: description,
          dataClasses: ['Açık Sistem Erişimi', 'Konfigürasyon Bilgileri', 'Hassas Veriler']
        })
      })
    }
    
    console.log('✅ LeakIX:', breaches.length, 'breach bulundu')

    if (breaches.length > 0) {
      console.log('\n📋 İlk 3 Breach:')
      breaches.slice(0, 3).forEach((breach, index) => {
        console.log(`  ${index + 1}. ${breach.name}`)
      })
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return breaches

  } catch (error) {
    console.error('\n❌ LeakIX HATASI ❌')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return []
  }
}

// Gravatar Scan
async function scanGravatar(email) {
  try {
    console.log('\n━━━━━━ Gravatar Taraması ━━━━━━')
    console.log('📧 Email:', email)

    const hash = crypto
      .createHash('md5')
      .update(email.toLowerCase().trim())
      .digest('hex')

    console.log('🔐 MD5 Hash:', hash)

    const response = await fetch(
      `https://www.gravatar.com/${hash}.json`,
      {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }
    )

    console.log('📊 Response Status:', response.status)

    if (!response.ok) {
      console.log('⚠️ Gravatar: Profil bulunamadı')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      return { hasProfile: false }
    }

    const data = await response.json()
    const entry = data.entry?.[0]
    
    if (!entry) {
      console.log('⚠️ Gravatar: Entry bulunamadı')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      return { hasProfile: false }
    }

    const accounts = []
    if (entry.accounts && Array.isArray(entry.accounts)) {
      entry.accounts.forEach((account) => {
        accounts.push({
          name: account.shortname || account.domain,
          url: account.url
        })
      })
    }

    console.log('✅ Gravatar: Profil bulundu!')
    console.log('👤 Display Name:', entry.displayName || 'N/A')
    console.log('📱 Accounts:', accounts.length)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    return {
      hasProfile: true,
      displayName: entry.displayName || entry.name?.formatted,
      username: entry.preferredUsername,
      profileUrl: entry.profileUrl,
      avatarUrl: `https://www.gravatar.com/avatar/${hash}?s=200`,
      location: entry.currentLocation,
      description: entry.aboutMe,
      accounts
    }

  } catch (error) {
    console.error('\n❌ Gravatar HATASI ❌')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return { hasProfile: false }
  }
}

// Risk skoru hesapla
function calculateRiskScore(breachCount) {
  if (breachCount === 0) return 100
  if (breachCount <= 5) return 80
  if (breachCount <= 15) return 60
  if (breachCount <= 50) return 40
  return 20
}

// Vercel Serverless Function
module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 YENİ TARAMA BAŞLADI!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', req.body?.email)
    console.log('⏰ Zaman:', new Date().toLocaleTimeString())
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const { email } = req.body

    if (!email) {
      console.log('❌ HATA: Email yok!')
      return res.status(400).json({ error: 'Email gerekli' })
    }

    console.log('🔍 API taramaları başlatılıyor...\n')

    // Paralel API taraması
    const [xposedResults, leakixResults, gravatarResults] = await Promise.all([
      scanXposedOrNot(email),
      scanLeakIX(email),
      scanGravatar(email)
    ])

    console.log('✅ Tüm API taramaları tamamlandı!\n')

    console.log('🔍 DEBUG - API Sonuçları:')
    console.log('  xposedResults:', xposedResults)
    console.log('  xposedResults length:', xposedResults.length)
    console.log('  leakixResults length:', leakixResults.length)
    console.log('  gravatarResults:', gravatarResults)

    const allBreaches = [...xposedResults, ...leakixResults]
    console.log('🔍 DEBUG - allBreaches:', allBreaches)
    console.log('🔍 DEBUG - allBreaches length:', allBreaches.length)
    
    const totalBreaches = allBreaches.length
    const riskScore = calculateRiskScore(totalBreaches)

    const successfulSources = []
    if (xposedResults.length > 0) successfulSources.push('XposedOrNot')
    if (leakixResults.length > 0) successfulSources.push('LeakIX')
    if (gravatarResults?.hasProfile) successfulSources.push('Gravatar')

    const progress = [
      { service: 'XposedOrNot', status: 'completed', count: xposedResults.length },
      { service: 'LeakIX', status: 'completed', count: leakixResults.length },
      { 
        service: 'Gravatar', 
        status: 'completed', 
        message: gravatarResults?.hasProfile ? 'Profil bulundu' : 'Profil bulunamadı' 
      }
    ]

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 SONUÇ RAPORU')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  XposedOrNot:', xposedResults.length, 'breach')
    console.log('  LeakIX:', leakixResults.length, 'breach')
    console.log('  Gravatar:', gravatarResults?.hasProfile ? '✅ Var' : '❌ Yok')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  📦 TOPLAM:', totalBreaches, 'breach')
    console.log('  🎯 RISK SKORU:', riskScore + '/100')
    console.log('  📌 KAYNAKLAR:', successfulSources.join(', ') || 'Yok')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Response gönderiliyor...\n\n')

    return res.status(200).json({
      email,
      breaches: allBreaches,
      profile: gravatarResults,
      totalBreaches,
      riskScore,
      sources: successfulSources,
      scannedAt: new Date().toISOString(),
      progress
    })

  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('❌❌❌ FATAL ERROR ❌❌❌')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('🔴 Type:', error.constructor.name)
    console.error('🔴 Message:', error.message)
    console.error('🔴 Stack:', error.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n')
    
    return res.status(500).json({ 
      error: 'Tarama sırasında hata oluştu',
      message: error.message 
    })
  }
}

