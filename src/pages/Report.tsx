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
      }
    }
  }, [scanResult, navigate])

  if (!scanResult) {
    return null
  }

  // Risk skoru hesapla (100 = en iyi, 0 = en kötü)
  const calculateRiskScore = () => {
    const breachCount = scanResult.breaches?.length || 0
    
    if (breachCount === 0) return 100    // Mükemmel
    if (breachCount <= 2) return 75      // İyi
    if (breachCount <= 5) return 50      // Orta
    if (breachCount <= 10) return 25     // Kötü
    return 0 // Çok Kötü
  }

  // Risk seviyesi bilgisi
  const getRiskLevel = (score: number) => {
    if (score === 100) return { 
      risk: 'Mükemmel', 
      emoji: '✅', 
      color: 'from-green-500 to-emerald-500', 
      textColor: 'text-green-600',
      bg: 'bg-green-50',
      message: 'E-postanız hiçbir veri sızıntısında bulunmamış!' 
    }
    if (score >= 75) return { 
      risk: 'İyi', 
      emoji: '🟢', 
      color: 'from-blue-500 to-cyan-500', 
      textColor: 'text-blue-600',
      bg: 'bg-blue-50',
      message: 'Az sayıda sızıntı tespit edildi. Şifrelerinizi güncelleyin.' 
    }
    if (score >= 50) return { 
      risk: 'Orta', 
      emoji: '🟡', 
      color: 'from-yellow-500 to-amber-500', 
      textColor: 'text-yellow-600',
      bg: 'bg-yellow-50',
      message: 'Orta düzeyde risk var. Hemen önlem alın!' 
    }
    if (score >= 25) return { 
      risk: 'Kötü', 
      emoji: '🔴', 
      color: 'from-orange-500 to-red-500', 
      textColor: 'text-orange-600',
      bg: 'bg-orange-50',
      message: 'Yüksek risk! Tüm şifrelerinizi değiştirin.' 
    }
    return { 
      risk: 'Çok Kötü', 
      emoji: '❌', 
      color: 'from-red-600 to-red-800', 
      textColor: 'text-red-800',
      bg: 'bg-red-100',
      message: 'Kritik seviye! Acil önlem gerekiyor!' 
    }
  }

  // Veriyi hazırla
  const {  email, breaches, profile, totalBreaches } = scanResult
  const riskScore = calculateRiskScore()
  const scoreData = getRiskLevel(riskScore)
  const displayedBreaches = showAll ? breaches : (breaches || []).slice(0, 10)

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


  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden py-12 px-6"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      {/* Gradient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* BAŞLIK */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl shadow-blue-500/40">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Güvenlik Raporu
          </h1>
          <p className="text-lg text-gray-300">
            <span className="text-blue-400 font-semibold">{email}</span> için sonuçlar
          </p>
        </motion.div>

        {/* SKOR KARTI - DARK THEME */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          {/* Gradient glow */}
          <div className={`absolute inset-0 bg-gradient-to-r ${scoreData.color} opacity-10 blur-3xl`} />
          
          <div className="relative">
            <h2 className="text-2xl font-bold text-white text-center mb-8 uppercase tracking-wider">
              GÜVENLİK SKORU
            </h2>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-center mb-6"
            >
              <div className="text-7xl md:text-9xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${scoreData.color} bg-clip-text text-transparent`}>
                  {riskScore}
                </span>
                <span className="text-gray-500 text-5xl">/100</span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8 max-w-md mx-auto">
              <div className="h-3 bg-slate-700/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${riskScore}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${scoreData.color} shadow-lg`}
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-4xl">{scoreData.emoji}</span>
                <span className="text-3xl font-bold text-white">
                  {scoreData.risk}
                </span>
              </div>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                {scoreData.message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* İSTATİSTİKLER - DARK THEME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 text-center hover:border-blue-500/50 transition-all duration-300 shadow-xl"
          >
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">{totalBreaches}</div>
            <div className="text-gray-300 font-medium">Toplam Veri Sızıntısı</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 text-center hover:border-purple-500/50 transition-all duration-300 shadow-xl"
          >
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 truncate">
              {(() => {
                const uniqueSources = [...new Set((breaches || []).map((b: any) => b.source))].filter(s => 
                  (breaches || []).filter((br: any) => br.source === s).length > 0
                )
                return uniqueSources.length > 0 ? `${uniqueSources.join(', ')}` : 'Henüz yok'
              })()}
            </div>
            <div className="text-gray-300 font-medium">Sonuç Bulunan Kaynaklar</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 text-center hover:border-green-500/50 transition-all duration-300 shadow-xl"
          >
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
              {(() => {
                const uniqueSources = [...new Set((breaches || []).map((b: any) => b.source))]
                return uniqueSources.length
              })()}
            </div>
            <div className="text-gray-300 font-medium">Kaynak Sayısı</div>
          </motion.div>
        </div>

        {/* ŞİMDİ NE YAPMALI BÖLÜMÜ - APPLE STYLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">💡</span>
            <h2 className="text-2xl font-semibold text-gray-900">
              Şimdi Ne Yapmalıyım?
            </h2>
          </div>
          
          <div className="space-y-4">
            {totalBreaches > 0 ? (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">🔐</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        1. Şifrelerinizi Derhal Değiştirin
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Sızıntıda bulunan platformlardaki şifrelerinizi hemen değiştirin. Aynı şifreyi başka yerlerde kullanıyorsanız onları da güncelleyin.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📱</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        2. İki Faktörlü Doğrulamayı Aktif Edin
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Tüm önemli hesaplarınızda 2FA'yı (Google Authenticator, SMS) mutlaka aktif edin.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">🔑</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        3. Güçlü ve Farklı Şifreler Kullanın
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Her platform için farklı, en az 12 karakterli şifreler kullanın. Şifre yöneticisi (Bitwarden, 1Password) kullanmayı düşünün.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">👁️</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        4. Hesap Aktivitelerinizi Takip Edin
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Banka hesapları, e-posta ve sosyal medya hesaplarınızda şüpheli aktivite olup olmadığını düzenli kontrol edin.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-white rounded-2xl">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Harika! Hiçbir sızıntı bulunamadı
                </h3>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                            {(() => {
                              // Teknik isimleri temizle
                              let name = breach.name
                              if (name.includes('Plugin') || name.includes('Http') || name.includes('Config')) {
                                return 'Sistem Sızıntısı'
                              }
                              if (name.includes('Database') || name.includes('DB')) {
                                return 'Veritabanı Sızıntısı'
                              }
                              if (name.includes('API')) {
                                return 'API Sızıntısı'
                              }
                              return name
                            })()}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(breach.breachDate || breach.date)}
                          </p>
                        </div>
                      </div>

                      {/* Kaynak Badge (Türkçe) */}
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${sourceConfig.badge}`}>
                        {breach.source === 'XposedOrNot' ? 'XposedOrNot' : breach.source}
                      </span>
                    </div>

                    {/* Açıklama / Detay Bilgisi */}
                    <div className="mb-4">
                      {breach.description ? (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {breach.description}
                        </p>
                      ) : (
                        <div className="text-sm text-gray-700 space-y-2">
                          <p className="leading-relaxed">
                            Bu e-posta adresi veri sızıntısında tespit edildi.
                          </p>
                          <div className="flex flex-col gap-1 text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">📅 Tarih:</span>
                              <span>{breach.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">🔍 Kaynak:</span>
                              <span>{breach.source}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">⚠️ Durum:</span>
                              <span className="text-red-600 font-semibold">Sızıntıda Bulundu</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>💡 Önerilen:</strong> Bu hesap için şifrenizi hemen değiştirin ve iki faktörlü doğrulamayı aktif edin.
                          </p>
                        </div>
                      )}
                    </div>

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
        {/* YENİ TARAMA BUTONU */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="py-5 px-12 bg-gradient-to-r from-blue-500 to-cyan-500 
                     text-white font-bold rounded-2xl shadow-2xl 
                     transition-all flex items-center justify-center space-x-3 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Yeni Tarama Yap</span>
          </motion.button>
        </motion.div>

        {/* FOOTER - DARK THEME */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-32 pt-16 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Dijital Ayak İzi
              </h3>
            </div>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              E-posta adresiniz yalnızca tarama için kullanılır ve saklanmaz. 
              Tüm işlemler anlık olarak yapılır.
            </p>
            
            {/* Links */}
            <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
              <button 
                onClick={() => setPrivacyModalOpen(true)}
                className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer font-medium"
              >
                Gizlilik Politikası
              </button>
              
              <span className="text-slate-700">•</span>
              
              <button 
                onClick={() => setAboutModalOpen(true)}
                className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer font-medium"
              >
                Hakkında
              </button>
              
              <span className="text-slate-700">•</span>
              
              <a 
                href="https://github.com/swordofyzc/dijital-ayak-izi" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
            
            {/* Copyright */}
            <p className="text-xs text-gray-500 mt-8">
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


