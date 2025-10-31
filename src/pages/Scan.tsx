import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface ScanProgress {
  service: string
  status: 'pending' | 'scanning' | 'completed' | 'failed'
  count?: number
  message?: string
}

const Scan = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email')

  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ScanProgress[]>([
    { service: 'XposedOrNot', status: 'scanning', message: '500+ veritabanı taranıyor...' },
    { service: 'Gravatar', status: 'scanning', message: 'Profil bilgileri alınıyor...' }
  ])

  useEffect(() => {
    // E-posta yoksa ana sayfaya yönlendir
    if (!email) {
      navigate('/')
      return
    }

    const scanEmail = async () => {
      try {
        console.log(`🚀 Backend'e tarama isteği gönderiliyor: ${email}`)
        console.log('📡 Backend URL: /api/scan')
        
        // Frontend'den XposedOrNot (Cloudflare bypass)
        let xposedBreaches: any[] = []
        try {
          const xposedRes = await fetch(
            `https://api.xposedornot.com/v1/check-email/${email}`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          )
          
          if (xposedRes.ok) {
            const xposedData = await xposedRes.json()
            
            // Response format: { "breaches": [["Breach1", "Breach2", ...]] }
            if (xposedData.breaches && Array.isArray(xposedData.breaches) && xposedData.breaches.length > 0) {
              const breachList = xposedData.breaches[0] // İlk array'i al
              xposedBreaches = breachList.filter((b: string) => b).map((name: string) => ({
                name: name,
                source: 'XposedOrNot',
                date: 'Tarih Bilinmiyor',
                description: `${name} veri sızıntısında bulundu`,
                dataClasses: []
              }))
            }
          }
        } catch (err) {
          console.log('XposedOrNot error:', err)
        }
        
        // Backend API'ye istek at (Gravatar için)
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        })

        console.log('📊 Response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ Backend hatası:', errorData)
          throw new Error(`API hatası: ${response.status}`)
        }

        const result = await response.json()
        
        // XposedOrNot sonuçlarını ekle
        result.breaches = [...xposedBreaches, ...(result.breaches || [])]
        result.totalBreaches = result.breaches.length
        
        console.log('✅ Backend tarama tamamlandı:', result)
        console.log('📦 Toplam breach:', result.totalBreaches)
        console.log('🎯 Risk skoru:', result.riskScore)
        console.log('🔍 Breaches Array:', result.breaches)
        console.log('🔍 Breaches Length:', result.breaches?.length)
        console.log('🔍 XposedOrNot breaches:', result.breaches?.filter((b: any) => b.source === 'XposedOrNot'))
        
        // Progress'i güncelle
        if (result.progress && Array.isArray(result.progress)) {
          setProgress(result.progress)
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Başarılı - Report sayfasına yönlendir
        navigate('/report', { 
          state: { 
            scanResult: result
          } 
        })
      } catch (err) {
        console.error('❌ Tarama hatası:', err)
        console.error('❌ Hata detayı:', err instanceof Error ? err.message : err)
        setError(err instanceof Error ? err.message : 'Bir sorun oluştu, lütfen tekrar deneyin')
      }
    }

    scanEmail()
  }, [email, navigate])

  // Hata durumu - Apple Style
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6"
           style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-gray-100"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6
                     bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl"
            style={{
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)'
            }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Bir Sorun Oluştu
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {error}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 
                     text-white font-semibold rounded-2xl
                     hover:shadow-lg transition-all duration-200"
            style={{
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            Ana Sayfaya Dön
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Loading ekranı - Apple Premium + Siber Güvenlik Karma Tema
  return (
    <div 
      className="min-h-screen bg-[#F5F5F7] relative overflow-hidden flex items-center justify-center px-6 py-12"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Subtle Background Pattern - Apple Style */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 113, 227, 0.15) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      {/* Soft Gradient Orbs - Apple Style Blurred */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-300 to-blue-400 rounded-full blur-[100px]"
      />

      <div className="max-w-5xl w-full relative z-10">
        {/* Email Header - Apple Style with Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Shield Icon - Subtle Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6
                     bg-gradient-to-br from-blue-500 to-blue-600 
                     rounded-2xl shadow-xl"
            style={{
              boxShadow: '0 10px 40px rgba(0, 113, 227, 0.3)'
            }}
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-gray-500 mb-3">
              Güvenlik Taraması
            </p>
            <p className="text-2xl font-semibold text-gray-900 mb-2 break-all">
              {email}
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Güvenli Bağlantı
              </span>
              <span className="text-gray-400">•</span>
              <span>500+ Veritabanı</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Premium Scanning Animation - Apple + Security */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center mb-12"
        >
          {/* Central Spinner with Glow */}
          <div className="relative w-40 h-40 mb-8">
            {/* Subtle Pulse Rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.4],
                  opacity: [0.4, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeOut'
                }}
                className="absolute inset-0 border-2 border-blue-400 rounded-full"
              />
            ))}

            {/* Main Spinner */}
            <div className="absolute inset-6 bg-white rounded-full 
                          flex items-center justify-center
                          shadow-2xl"
                 style={{
                   boxShadow: '0 20px 60px rgba(0, 113, 227, 0.25)'
                 }}>
              
              {/* Rotating Border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(0, 113, 227, 0.6) 50%, transparent 100%)',
                  padding: '3px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              {/* Center Icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <svg className="w-14 h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>

              {/* Scanning Indicators */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6
                  }}
                  className="absolute w-3 h-3 bg-blue-500 rounded-full"
                  style={{
                    top: `${30 + i * 15}%`,
                    right: `${25 + i * 10}%`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status Text - Apple Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Dijital Ayak İziniz Taranıyor
            </h3>
            <p className="text-gray-600">
              500+ veritabanında güvenlik kontrolü yapılıyor
            </p>
            
            {/* Progress Indicator */}
            <motion.div 
              className="flex items-center justify-center gap-1.5 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Progress Cards - Apple Premium Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {progress.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100
                       hover:shadow-2xl transition-all duration-300"
              style={{
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Status Icon - Apple Style */}
                {item.status === 'scanning' ? (
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                               flex items-center justify-center"
                      style={{
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full" />
                      </div>
                    </motion.div>
                  </div>
                ) : item.status === 'completed' ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 
                             flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 
                             flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{item.service}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.status === 'scanning' ? 'Taranıyor...' : 
                     item.status === 'completed' ? 'Tamamlandı' : 'Başarısız'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {item.message || (item.status === 'scanning' ? 'İşleniyor...' : 'Bitti')}
              </p>

              {item.count !== undefined && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="flex items-baseline gap-2 pt-3 border-t border-gray-100"
                >
                  <span className="text-3xl font-bold text-transparent bg-clip-text 
                                 bg-gradient-to-r from-blue-600 to-blue-400">
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-500">sonuç bulundu</span>
                </motion.div>
              )}

              {/* Scanning Progress Bar */}
              {item.status === 'scanning' && (
                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Overall Progress Bar - Apple Premium Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          style={{
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm font-semibold text-gray-900">
                Genel İlerleme
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Tüm güvenlik kontrolleri • Gerçek zamanlı analiz
              </p>
            </div>
            <motion.div
              key={Math.round((progress.filter(p => p.status === 'completed' || p.status === 'failed').length / progress.length) * 100)}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex items-center gap-2"
            >
              <span className="text-5xl font-bold text-transparent bg-clip-text 
                           bg-gradient-to-r from-blue-600 to-blue-400">
                {Math.round((progress.filter(p => p.status === 'completed' || p.status === 'failed').length / progress.length) * 100)}
              </span>
              <span className="text-2xl font-semibold text-gray-400">%</span>
            </motion.div>
          </div>

          {/* Progress Bar - Apple Style */}
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ 
                width: `${(progress.filter(p => p.status === 'completed' || p.status === 'failed').length / progress.length) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full
                       relative overflow-hidden"
              style={{
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ width: '40%' }}
              />
            </motion.div>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {progress.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'failed' ? 'bg-red-500' :
                  'bg-blue-500 animate-pulse'
                }`} 
                style={{
                  boxShadow: item.status === 'completed' ? '0 0 8px rgba(34, 197, 94, 0.6)' :
                            item.status === 'failed' ? '0 0 8px rgba(239, 68, 68, 0.6)' :
                            '0 0 8px rgba(59, 130, 246, 0.6)'
                }}
                />
                <span className="text-xs text-gray-600 font-medium">{item.service}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Şifreli Bağlantı</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Güvenli Tarama</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>Anlık Analiz</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Scan

