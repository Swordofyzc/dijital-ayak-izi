import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '../components/Modal'

// ScanResult type tanımı
interface ScanResult {
  email: string
  breaches: any[]
  profile: any
  totalBreaches: number
  riskScore: number
  sources: string[]
}

const Report = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { scanResult } = (location.state as { scanResult?: ScanResult }) || {}

  const [showAll, setShowAll] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [aboutModalOpen, setAboutModalOpen] = useState(false)

  useEffect(() => {
    // Veri yoksa ana sayfaya yönlendir
    if (!scanResult) {
      console.warn('⚠️ Report: ScanResult verisi yok, ana sayfaya yönlendiriliyor')
      navigate('/')
    } else {
      console.log('✅ Report sayfasına gelen veri:', scanResult)
      console.log('📊 Breaches:', scanResult.breaches)
      console.log('📊 Breaches Length:', scanResult.breaches?.length)
      console.log('📊 Total Breaches:', scanResult.totalBreaches)
      console.log('📊 Sources:', scanResult.sources)
      if (scanResult.breaches) {
        console.log('🔴 XposedOrNot breaches:', (scanResult.breaches || []).filter((b: any) => b.source === 'XposedOrNot'))
        console.log('🟣 LeakIX breaches:', (scanResult.breaches || []).filter((b: any) => b.source === 'LeakIX'))
      }
    }
  }, [scanResult, navigate])

  if (!scanResult) {
    return null
  }

  // Skor hesaplama fonksiyonu
  const getScoreData = (score: number) => {
    if (score >= 90) return { risk: 'Mükemmel', emoji: '✅', color: 'from-green-500 to-emerald-500', message: 'E-postanız hiçbir veri sızıntısında bulunmamış!' }
    if (score >= 70) return { risk: 'İyi', emoji: '🟢', color: 'from-blue-500 to-cyan-500', message: 'Az sayıda sızıntı tespit edildi. Şifrelerinizi güncelleyin.' }
    if (score >= 50) return { risk: 'Orta', emoji: '🟡', color: 'from-yellow-500 to-amber-500', message: 'Orta düzeyde risk var. Hemen önlem alın!' }
    if (score >= 30) return { risk: 'Kötü', emoji: '🟠', color: 'from-orange-500 to-red-500', message: 'Yüksek risk! Tüm şifrelerinizi değiştirin.' }
    return { risk: 'Çok Kötü', emoji: '🔴', color: 'from-red-600 to-red-800', message: 'Çok yüksek risk! Acil önlem gerekiyor!' }
  }

  // Veriyi hazırla
  const {  email, breaches, profile, totalBreaches, riskScore, sources } = scanResult
  const scoreData = getScoreData(riskScore)
  const displayedBreaches = showAll ? breaches : (breaches || []).slice(0, 10)

  // İlk sızıntı yılını bul
  const firstBreachYear = (breaches || []).length > 0
    ? (breaches || []).reduce((min: number, breach: any) => {
        if (!breach.date) return min
        const year = parseInt(breach.date.split('-')[0])
        return year < min ? year : min
      }, 9999)
    : null

  // Öneriler
  const recommendations = [
    {
      icon: '🔑',
      title: 'Şifrelerinizi Değiştirin',
      description: 'Sızdırılan hesaplarınızın şifrelerini hemen değiştirin. Her hesap için farklı ve güçlü şifreler kullanın.'
    },
    {
      icon: '🛡️',
      title: 'İki Faktörlü Doğrulama (2FA)',
      description: 'Hesaplarınıza ekstra güvenlik katmanı ekleyin. SMS, authenticator app veya güvenlik anahtarı kullanın.'
    },
    {
      icon: '📧',
      title: 'E-posta İzleme',
      description: 'Düzenli olarak e-postanızı kontrol edin. Haveibeenpwned.com gibi servislere abone olun.'
    }
  ]

  const shareOnLinkedIn = () => {
    const url = window.location.href
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <div 
      className="min-h-screen bg-[#F5F5F7] py-12 px-6"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* BÖLÜM 1: BAŞLIK */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Dijital Ayak İzi Raporu
          </h1>
          <p className="text-xl text-gray-600">
            <span className="font-semibold">{email}</span> için sonuçlar
          </p>
        </motion.div>

        {/* BÖLÜM 2: SKOR KARTI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          {/* Gradient border effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${scoreData.color} opacity-10`} />
          
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              DİJİTAL AYAK İZİ SKORU
            </h2>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-center mb-6"
            >
              <div className="text-7xl md:text-8xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${scoreData.color} bg-clip-text text-transparent`}>
                  {riskScore}
                </span>
                <span className="text-gray-400 text-5xl">/100</span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8 max-w-md mx-auto">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${riskScore}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${scoreData.color}`}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl">{scoreData.emoji}</span>
                <span className="text-2xl font-semibold text-gray-900">
                  Risk Seviyesi: {scoreData.risk}
                </span>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {scoreData.message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* BÖLÜM 3: İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-5xl font-bold text-[#0071E3] mb-2">{totalBreaches}</div>
            <div className="text-gray-600 font-medium">Toplam Veri Sızıntısı</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-xl font-bold text-[#0071E3] mb-2 truncate">
              {(sources || []).join(', ')}
            </div>
            <div className="text-gray-600 font-medium">Taranan Kaynaklar</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-5xl font-bold text-[#0071E3] mb-2">
              {firstBreachYear && firstBreachYear !== 9999 ? firstBreachYear : 'N/A'}
            </div>
            <div className="text-gray-600 font-medium">İlk Sızıntı Yılı</div>
          </motion.div>
        </div>

        {/* ŞİMDİ NE YAPMALI BÖLÜMÜ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 mb-8 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Şimdi Ne Yapmalıyım?
          </h2>
          
          <div className="space-y-4">
            {totalBreaches > 0 ? (
              <>
                <div className="flex items-start gap-4 bg-white/70 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-2xl flex-shrink-0">1️⃣</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Şifrelerinizi Derhal Değiştirin
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Sızıntıda bulunan platformlardaki şifrenizi hemen değiştirin. 
                      Aynı şifreyi başka yerlerde kullanıyorsanız onları da güncelleyin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/70 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-2xl flex-shrink-0">2️⃣</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      İki Faktörlü Doğrulamayı Aktif Edin
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Tüm önemli hesaplarınızda 2FA'yı (Google Authenticator, SMS) 
                      mutlaka aktif edin. Bu ekstra güvenlik katmanı çok önemli.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/70 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-2xl flex-shrink-0">3️⃣</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Güçlü ve Farklı Şifreler Kullanın
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Her platform için farklı, en az 12 karakterli şifreler kullanın. 
                      Şifre yöneticisi (Bitwarden, 1Password) kullanmayı düşünün.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/70 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-2xl flex-shrink-0">4️⃣</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Hesap Aktivitelerinizi Takip Edin
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Banka hesapları, e-posta ve sosyal medya hesaplarınızda 
                      şüpheli aktivite olup olmadığını düzenli kontrol edin.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-white/70 rounded-2xl backdrop-blur-sm">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Harika! Hiçbir sızıntı bulunamadı
                </h3>
                <p className="text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  E-posta adresiniz bilinen veri sızıntılarında bulunmuyor. 
                  Ancak yine de güvenlik önlemlerinizi sürdürmeyi unutmayın.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* BÖLÜM 4: SIZINTI LİSTESİ */}
        {totalBreaches === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 bg-white rounded-3xl shadow-sm p-12 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Harika Haber!
            </h2>
            <p className="text-xl text-gray-600">
              E-postanız hiçbir bilinen veri sızıntısında bulunmuyor.
            </p>
          </motion.div>
        ) : breaches?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Bulunan Veri Sızıntıları ({breaches?.length})
            </h2>
            
            <div className="space-y-3">
              {(displayedBreaches || []).map((breach: any, index: number) => {
                // Kaynak bazlı renk ve icon - APPLE STYLE
                const getSourceConfig = () => {
                  if (breach.source === 'XposedOrNot') return { 
                    gradient: 'from-red-500 to-red-600', 
                    badge: 'bg-red-100 text-red-700' 
                  }
                  if (breach.source === 'LeakIX') return { 
                    gradient: 'from-purple-500 to-purple-600', 
                    badge: 'bg-purple-100 text-purple-700' 
                  }
                  return { 
                    gradient: 'from-red-500 to-red-600', 
                    badge: 'bg-red-100 text-red-700' 
                  }
                }

                const sourceConfig = getSourceConfig()
                
                // Tarih formatla (Türkçe)
                const formatDate = (dateStr: string | null | undefined) => {
                  if (!dateStr) return 'Tarih bilinmiyor'
                  try {
                    const date = new Date(dateStr)
                    if (isNaN(date.getTime())) return 'Tarih bilinmiyor'
                    return date.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  } catch {
                    return 'Tarih bilinmiyor'
                  }
                }

                // Severity Türkçesi
                const getSeverityText = (severity: string) => {
                  if (!severity) return 'Bilinmiyor'
                  switch(severity.toLowerCase()) {
                    case 'critical': return 'Kritik'
                    case 'high': return 'Yüksek'
                    case 'medium': return 'Orta'
                    case 'low': return 'Düşük'
                    default: return 'Bilinmiyor'
                  }
                }

                // Severity rengi
                const getSeverityColor = (severity: string) => {
                  if (!severity) return 'bg-gray-100 text-gray-700'
                  switch(severity.toLowerCase()) {
                    case 'critical':
                    case 'high':
                      return 'bg-red-100 text-red-700'
                    case 'medium':
                      return 'bg-yellow-100 text-yellow-700'
                    case 'low':
                      return 'bg-green-100 text-green-700'
                    default:
                      return 'bg-gray-100 text-gray-700'
                  }
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Icon - APPLE STYLE */}
                        <div className={`w-14 h-14 bg-gradient-to-br ${sourceConfig.gradient} rounded-2xl 
                                      flex items-center justify-center shadow-lg`}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        
                        {/* Breach Info */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {breach.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(breach.breachDate || breach.date)}
                          </p>
                        </div>
                      </div>

                      {/* Source Badge */}
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${sourceConfig.badge}`}>
                        {breach.source}
                      </span>
                    </div>

                    {/* Description */}
                    {breach.description && (
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        {breach.description}
                      </p>
                    )}

                    {/* Data Classes */}
                    {breach.dataClasses && breach.dataClasses.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-600 font-semibold mb-2 block">
                          📊 Sızan Veriler:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(breach.dataClasses || []).map((dataClass: string, i: number) => (
                            <span 
                              key={i}
                              className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200"
                            >
                              {dataClass}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Severity */}
                    {breach.severity && (
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600 font-semibold">
                          ⚠️ Tehdit Seviyesi:
                        </span>
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                          getSeverityColor(breach.severity)
                        }`}>
                          {getSeverityText(breach.severity)}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {breaches?.length > 10 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAll(!showAll)}
                className="mt-6 w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 
                         font-semibold rounded-2xl transition-colors"
              >
                {showAll ? 'Daha Az Göster' : 'Tümünü Göster'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* GRAVATAR PROFİLİ */}
        {profile && profile?.hasProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8 bg-white rounded-3xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📧 E-posta Profili (Gravatar)
            </h2>
            <div className="flex items-start space-x-6">
              {profile?.avatarUrl && (
                <img 
                  src={profile?.avatarUrl} 
                  alt={profile?.displayName || 'Profile'} 
                  className="w-24 h-24 rounded-full border-4 border-gray-100"
                />
              )}
              <div className="flex-1">
                {profile?.displayName && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {profile?.displayName}
                  </h3>
                )}
                {profile?.username && (
                  <p className="text-gray-600 mb-2">@{profile?.username}</p>
                )}
                {profile?.location && (
                  <p className="text-sm text-gray-500 mb-2">📍 {profile?.location}</p>
                )}
                {profile?.description && (
                  <p className="text-gray-700 mt-3">{profile?.description}</p>
                )}
                {profile?.accounts && profile?.accounts?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Bağlı hesaplar:</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.accounts || []).map((account: any, idx: number) => (
                        <a
                          key={idx}
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                        >
                          {account.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* BÖLÜM 5: ÖNERİLER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Güvenlik Önerileri
          </h2>
          
          <div className="space-y-3">
            {(recommendations || []).map((rec, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <button
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{rec.icon}</span>
                    <span className="font-semibold text-gray-900 text-lg">{rec.title}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: openAccordion === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 text-2xl"
                  >
                    ▼
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {openAccordion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                        {rec.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BÖLÜM 6: PAYLAŞ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={shareOnLinkedIn}
            className="flex-1 py-4 px-6 bg-[#0077B5] text-white font-semibold rounded-full 
                     shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-xl">🔗</span>
            <span>Raporu Paylaş</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-[#0071E3] to-[#00A8E8] 
                     text-white font-semibold rounded-full shadow-lg hover:shadow-xl 
                     transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-xl">🏠</span>
            <span>Ana Sayfaya Dön</span>
          </motion.button>
        </motion.div>

        {/* FOOTER - ÇALIŞIR BUTONLAR */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 pt-12 border-t border-gray-200 bg-white"
        >
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              Dijital Ayak İzi Tarayıcı
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              E-posta adresiniz yalnızca tarama için kullanılır ve saklanmaz. 
              Tüm işlemler anlık olarak yapılır.
            </p>
            
            {/* Linkler - MODAL */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <button 
                onClick={() => setPrivacyModalOpen(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium"
              >
                Gizlilik Politikası
              </button>
              
              <span className="text-gray-300">•</span>
              
              <button 
                onClick={() => setAboutModalOpen(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium"
              >
                Hakkında
              </button>
              
              <span className="text-gray-300">•</span>
              
              <a 
                href="https://github.com/swordofyzc/dijital-ayak-izi" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
            
            {/* Copyright */}
            <p className="text-xs text-gray-400 mt-8">
              © 2025 Dijital Ayak İzi. Tüm hakları saklıdır.
            </p>
          </div>
        </motion.footer>

        {/* Gizlilik Politikası Modal */}
        <Modal 
          isOpen={privacyModalOpen} 
          onClose={() => setPrivacyModalOpen(false)}
          title="Gizlilik Politikası"
        >
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Veri Toplama</h4>
                <p className="text-sm">
                  E-posta adresiniz yalnızca tarama işlemi için kullanılır ve 
                  <strong className="text-gray-900"> hiçbir şekilde kaydedilmez</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Anlık İşlem</h4>
                <p className="text-sm">
                  Tüm tarama işlemleri anlık olarak yapılır. Tarama tamamlandıktan sonra 
                  hiçbir veri sunucularımızda saklanmaz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🚫</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Üçüncü Parti Paylaşım</h4>
                <p className="text-sm">
                  E-posta adresiniz hiçbir üçüncü parti ile paylaşılmaz. Sadece açık 
                  kaynak API'lere sorgu gönderilir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Güvenlik</h4>
                <p className="text-sm">
                  Tüm bağlantılar HTTPS üzerinden şifrelenir. Log kayıtları tutulmaz.
                </p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Hakkında Modal */}
        <Modal 
          isOpen={aboutModalOpen} 
          onClose={() => setAboutModalOpen(false)}
          title="Hakkında"
        >
          <div className="space-y-6">
            {/* Proje Açıklaması */}
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bu proje, e-posta adresinizin bilinen veri sızıntılarında olup olmadığını 
                kontrol etmenizi sağlar. Dijital güvenlik farkındalığını artırmak amacıyla 
                geliştirilmiştir.
              </p>
            </div>

            {/* Kaynaklar */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span>
                Tarama Kaynakları
              </h4>
              <div className="space-y-3">
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <h5 className="font-semibold text-gray-900 mb-1">XposedOrNot</h5>
                  <p className="text-sm text-gray-600">
                    500+ veri sızıntısı veritabanı
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h5 className="font-semibold text-gray-900 mb-1">LeakIX</h5>
                  <p className="text-sm text-gray-600">
                    Açık veritabanları ve yanlış yapılandırmalar
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h5 className="font-semibold text-gray-900 mb-1">Gravatar</h5>
                  <p className="text-sm text-gray-600">
                    Kamuya açık profil bilgileri
                  </p>
                </div>
              </div>
            </div>

            {/* Geliştirici */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>👨‍💻</span>
                Geliştirici
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                <strong>@swordofyzc</strong> tarafından geliştirilmiştir.
              </p>
              <p className="text-sm text-gray-600">
                Bu proje açık kaynak olarak geliştirilmiştir. 
                Katkıda bulunmak için GitHub'da inceleyebilirsiniz.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Report

