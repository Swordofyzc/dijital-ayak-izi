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
    <div className="min-h-screen bg-[#F5F5F7]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔍</span>
            <span className="text-xl font-semibold text-gray-900">Dijital Ayak İzi</span>
          </div>
          <a
            href="#about"
            className="text-gray-600 hover:text-[#0071E3] transition-colors duration-200"
          >
            Hakkında
          </a>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight">
            Dijital Ayak İzinizi
            <br />
            <span className="bg-gradient-to-r from-[#0071E3] to-[#00A8E8] bg-clip-text text-transparent">
              Keşfedin
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            E-posta adresinizi girin, hangi veri sızıntılarında
            <br />
            olduğunuzu anında öğrenin
          </p>
        </motion.div>

        {/* EMAIL INPUT FORM */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-32"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="ornek@email.com"
              className="flex-1 py-4 px-6 rounded-2xl bg-white text-gray-900 text-lg
                       shadow-lg border border-gray-200/50
                       focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent
                       transition-all duration-200 placeholder-gray-400"
            />
            <motion.button
              type="submit"
              disabled={!isValidEmail}
              whileHover={{ scale: isValidEmail ? 1.05 : 1 }}
              whileTap={{ scale: isValidEmail ? 0.95 : 1 }}
              className={`px-8 py-4 rounded-full text-white font-semibold text-lg
                       shadow-lg transition-all duration-200
                       ${
                         isValidEmail
                           ? 'bg-gradient-to-r from-[#0071E3] to-[#00A8E8] hover:shadow-xl cursor-pointer'
                           : 'bg-gray-300 cursor-not-allowed'
                       }`}
            >
              Ayak İzimi Tara
            </motion.button>
          </div>
        </motion.form>

        {/* FEATURES SECTION - APPLE STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100
                       hover:shadow-xl transition-all duration-300"
            >
              {/* APPLE STYLE ICON */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl 
                            flex items-center justify-center mb-6 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* NASIL ÇALIŞIR BÖLÜMÜ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-24 mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Nasıl Çalışır?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Adım 1 - APPLE STYLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. E-posta Girin
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kontrol etmek istediğiniz e-posta adresinizi girin
              </p>
            </motion.div>

            {/* Adım 2 - APPLE STYLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Tarama Başlat
              </h3>
              <p className="text-gray-600 leading-relaxed">
                2 farklı kaynaktan veri sızıntıları taranır
              </p>
            </motion.div>

            {/* Adım 3 - APPLE STYLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Sonuçları Görün
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Detaylı rapor ve güvenlik önerileri alın
              </p>
            </motion.div>
          </div>

          {/* Güvenlik Notu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 
                     rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-start gap-6">
              <div className="text-5xl">🔒</div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Verileriniz Güvende
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  E-posta adresiniz yalnızca tarama için kullanılır ve 
                  <strong> hiçbir şekilde kaydedilmez</strong>. 
                  Tüm işlemler anlık olarak yapılır ve veri saklanmaz.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* SSS BÖLÜMÜ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-24 mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Sık Sorulan Sorular
          </h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* SSS 1 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                       hover:shadow-md transition-shadow group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer text-lg 
                               hover:text-[#0071E3] transition-colors">
                Veri sızıntısı nedir?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
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
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                       hover:shadow-md transition-shadow group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer text-lg 
                               hover:text-[#0071E3] transition-colors">
                E-postam sızıntıda bulunursa ne yapmalıyım?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                <strong>1.</strong> Derhal şifrenizi değiştirin<br/>
                <strong>2.</strong> Aynı şifreyi kullanan diğer hesaplarınızı güncelleyin<br/>
                <strong>3.</strong> İki faktörlü doğrulamayı (2FA) aktif edin<br/>
                <strong>4.</strong> Şüpheli aktiviteleri takip edin
              </p>
            </motion.details>

            {/* SSS 3 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                       hover:shadow-md transition-shadow group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer text-lg 
                               hover:text-[#0071E3] transition-colors">
                Hangi kaynaklar taranıyor?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Sistem şu kaynaklardan veri toplar:<br/>
                • <strong>XposedOrNot:</strong> 500+ veri sızıntısı veritabanı<br/>
                • <strong>Gravatar:</strong> Kamuya açık profil bilgileri
              </p>
            </motion.details>

            {/* SSS 4 */}
            <motion.details
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                       hover:shadow-md transition-shadow group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer text-lg 
                               hover:text-[#0071E3] transition-colors">
                Risk skoru nasıl hesaplanır?
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Risk skoru, bulunan toplam sızıntı sayısına göre hesaplanır:<br/>
                • <strong>0 sızıntı:</strong> 100/100 (Mükemmel)<br/>
                • <strong>1-5 sızıntı:</strong> 80/100 (İyi)<br/>
                • <strong>6-15 sızıntı:</strong> 60/100 (Orta)<br/>
                • <strong>16+ sızıntı:</strong> 40/100 (Risk)
              </p>
            </motion.details>
          </div>
        </motion.section>
      </div>

      {/* FOOTER - ÇALIŞIR BUTONLAR */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="mt-24 py-12 border-t border-gray-200 bg-white"
      >
        <div className="max-w-5xl mx-auto px-6">
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

