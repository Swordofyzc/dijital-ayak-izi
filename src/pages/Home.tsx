import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Modal from '../components/Modal'

const Home = () => {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(value))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail) {
      navigate(`/scan?email=${encodeURIComponent(email)}`)
    }
  }

  const features = [
    {
      title: 'Hızlı Tarama',
      description: '2 farklı kaynaktan saniyeler içinde kapsamlı tarama',
      gradient: 'from-blue-500 to-blue-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: '%100 Güvenli',
      description: 'Verileriniz kaydedilmez, yalnızca anlık tarama yapılır',
      gradient: 'from-green-500 to-green-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Detaylı Rapor',
      description: 'Risk skoru ve güvenlik önerileri ile kapsamlı analiz',
      gradient: 'from-purple-500 to-purple-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden" 
         style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      {/* Animated Background Pattern */}
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
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
      />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Dijital Ayak İzi</span>
          </div>
          <button
            onClick={() => setAboutModalOpen(true)}
            className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Hakkında
          </button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-400 font-medium">Gerçek Zamanlı Güvenlik Taraması</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Dijital Ayak İzinizi
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Keşfedin
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            E-posta adresinizi girin, hangi veri sızıntılarında olduğunuzu
            <br className="hidden md:block" />
            anında öğrenin ve güvenlik önerileri alın
          </p>
        </motion.div>

        {/* EMAIL INPUT FORM */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="ornek@email.com"
              className="flex-1 py-5 px-7 rounded-2xl bg-slate-800/50 backdrop-blur-xl text-white text-lg
                       shadow-2xl border border-slate-700/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-300 placeholder-gray-400"
            />
            <motion.button
              type="submit"
              disabled={!isValidEmail}
              whileHover={{ scale: isValidEmail ? 1.05 : 1, boxShadow: isValidEmail ? '0 20px 40px rgba(59, 130, 246, 0.4)' : '' }}
              whileTap={{ scale: isValidEmail ? 0.95 : 1 }}
              className={`px-10 py-5 rounded-2xl text-white font-bold text-lg
                       shadow-2xl transition-all duration-300
                       ${
                         isValidEmail
                           ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 cursor-pointer'
                           : 'bg-slate-700/50 cursor-not-allowed opacity-50'
                       }`}
            >
              Tara
            </motion.button>
          </div>
          
          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Şifreli Bağlantı</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Veri Kaydedilmez</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Anlık Sonuç</span>
            </div>
          </motion.div>
        </motion.form>

        {/* FEATURES SECTION - GLASSMORPHISM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50
                           hover:border-blue-500/50 transition-all duration-300 shadow-2xl">
                {/* ICON */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl 
                              flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30
                              group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* NASIL ÇALIŞIR BÖLÜMÜ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-32 mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-gray-400 text-lg">3 basit adımda dijital güvenliğinizi kontrol edin</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Adım 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 text-center
                           hover:border-blue-500/50 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl 
                              flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30
                              group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-4">
                  Adım 1
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  E-posta Girin
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Kontrol etmek istediğiniz e-posta adresinizi güvenli formumuz üzerinden girin
                </p>
              </div>
            </motion.div>

            {/* Adım 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 text-center
                           hover:border-purple-500/50 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl 
                              flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30
                              group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-4">
                  Adım 2
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Tarama Başlat
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  2 güvenilir kaynaktan anlık veri sızıntı kontrolü yapılır
                </p>
              </div>
            </motion.div>

            {/* Adım 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 text-center
                           hover:border-green-500/50 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl 
                              flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30
                              group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm font-semibold mb-4">
                  Adım 3
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Sonuçları Görün
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Detaylı rapor ve kişiselleştirilmiş güvenlik önerileri alın
                </p>
              </div>
            </motion.div>
          </div>

          {/* Güvenlik Notu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-30" />
            <div className="relative bg-slate-800/60 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-3">
                    Verileriniz Güvende
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    E-posta adresiniz yalnızca tarama için kullanılır ve 
                    <span className="text-green-400 font-semibold"> hiçbir şekilde kaydedilmez</span>. 
                    Tüm işlemler anlık olarak yapılır, hiçbir veri saklanmaz.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* SSS BÖLÜMÜ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-32 mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-gray-400 text-lg">Merak edilenlerin cevapları</p>
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* SSS 1 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 
                       hover:border-blue-500/50 transition-all duration-300 group"
            >
              <summary className="font-semibold text-white cursor-pointer text-lg 
                               hover:text-blue-400 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Veri sızıntısı nedir?
              </summary>
              <p className="mt-4 text-gray-300 leading-relaxed pl-7">
                Veri sızıntısı, bir şirketin veya platformun veri tabanının 
                hacklenip internete sızdırılması olayıdır. Bu sızıntılarda 
                genellikle e-posta, şifre, telefon gibi kişisel bilgiler bulunur.
              </p>
            </motion.details>

            {/* SSS 2 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 
                       hover:border-blue-500/50 transition-all duration-300 group"
            >
              <summary className="font-semibold text-white cursor-pointer text-lg 
                               hover:text-blue-400 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                E-postam sızıntıda bulunursa ne yapmalıyım?
              </summary>
              <p className="mt-4 text-gray-300 leading-relaxed pl-7">
                <span className="text-blue-400 font-semibold">1.</span> Derhal şifrenizi değiştirin<br/>
                <span className="text-blue-400 font-semibold">2.</span> Aynı şifreyi kullanan diğer hesaplarınızı güncelleyin<br/>
                <span className="text-blue-400 font-semibold">3.</span> İki faktörlü doğrulamayı (2FA) aktif edin<br/>
                <span className="text-blue-400 font-semibold">4.</span> Şüpheli aktiviteleri takip edin
              </p>
            </motion.details>

            {/* SSS 3 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 
                       hover:border-blue-500/50 transition-all duration-300 group"
            >
              <summary className="font-semibold text-white cursor-pointer text-lg 
                               hover:text-blue-400 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Hangi kaynaklar taranıyor?
              </summary>
              <p className="mt-4 text-gray-300 leading-relaxed pl-7">
                Sistem şu kaynaklardan veri toplar:<br/>
                • <span className="text-blue-400 font-semibold">XposedOrNot:</span> 500+ veri sızıntısı veritabanı<br/>
                • <span className="text-blue-400 font-semibold">Gravatar:</span> Kamuya açık profil bilgileri
              </p>
            </motion.details>

            {/* SSS 4 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 
                       hover:border-blue-500/50 transition-all duration-300 group"
            >
              <summary className="font-semibold text-white cursor-pointer text-lg 
                               hover:text-blue-400 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Risk skoru nasıl hesaplanır?
              </summary>
              <p className="mt-4 text-gray-300 leading-relaxed pl-7">
                Risk skoru, bulunan toplam sızıntı sayısına göre hesaplanır:<br/>
                • <span className="text-green-400 font-semibold">0 sızıntı:</span> 100/100 (Mükemmel)<br/>
                • <span className="text-blue-400 font-semibold">1-2 sızıntı:</span> 75/100 (İyi)<br/>
                • <span className="text-yellow-400 font-semibold">3-5 sızıntı:</span> 50/100 (Orta)<br/>
                • <span className="text-orange-400 font-semibold">6-10 sızıntı:</span> 25/100 (Kötü)<br/>
                • <span className="text-red-400 font-semibold">11+ sızıntı:</span> 0/100 (Kritik)
              </p>
            </motion.details>
          </div>
        </motion.section>
      </div>

      {/* FOOTER - DARK THEME */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="relative z-10 mt-32 py-16 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-6">
          {/* Tarama Kaynakları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="font-bold text-white">XposedOrNot</h4>
              </div>
              <p className="text-sm text-gray-400">500+ veri sızıntısı veritabanı</p>
            </div>
            
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-white">Gravatar</h4>
              </div>
              <p className="text-sm text-gray-400">Kamuya açık profil bilgileri</p>
            </div>
          </div>

          {/* Center Section */}
          <div className="text-center mb-8">
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
  )
}

export default Home

