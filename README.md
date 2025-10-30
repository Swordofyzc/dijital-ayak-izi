# 🔍 Dijital Ayak İzi Tarayıcı

E-posta adresinizin bilinen veri sızıntılarında olup olmadığını kontrol edin. Modern, hızlı ve güvenli.

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)

## ✨ Özellikler

- 🚀 **Hızlı Tarama**: 3 farklı kaynaktan saniyeler içinde kapsamlı analiz
- 🔒 **100% Güvenli**: Verileriniz kaydedilmez, sadece anlık tarama yapılır
- 📊 **Detaylı Rapor**: Risk skoru ve kişiselleştirilmiş güvenlik önerileri
- 🎨 **Modern Tasarım**: Apple-inspired minimalist ve responsive arayüz
- 🇹🇷 **Türkçe Destek**: Tam Türkçe arayüz ve açıklamalar
- ⚡ **Gerçek Zamanlı**: Anlık tarama ve sonuç görüntüleme

## 🎯 Tarama Kaynakları

- **XposedOrNot**: 500+ veri sızıntısı veritabanı
- **LeakIX**: Açık veritabanları ve güvenlik açıkları
- **Gravatar**: Kamuya açık profil bilgileri

## 🛠️ Teknolojiler

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (Animasyonlar)
- React Router
- Vite (Build tool)

### Backend
- Node.js
- Express
- CORS
- Axios

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

1. **Repoyu klonlayın**
```bash
git clone https://github.com/swordofyzc/dijital-ayak-izi.git
cd dijital-ayak-izi
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**

`.env` dosyası oluşturun (opsiyonel):
```env
LEAKIX_API_KEY=your_api_key_here
PORT=3001
```

4. **Development modda çalıştırın**

İki ayrı terminal açın:

**Terminal 1 - Backend:**
```bash
npm run server:watch
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:5173
```

## 📦 Production Build

### Frontend
```bash
npm run build
```

### Backend
```bash
npm run server:start
```

## 🎨 Ekran Görüntüleri

### Ana Sayfa
- Minimalist email input
- Apple-style tasarım
- Smooth animasyonlar

### Tarama Ekranı
- Gerçek zamanlı ilerleme
- Progress indicators
- 3 kaynak taraması

### Rapor Sayfası
- Risk skoru (0-100)
- Detaylı breach listesi
- Güvenlik önerileri
- Kaynak bazlı filtreleme

## 🔒 Gizlilik

- E-posta adresiniz **hiçbir şekilde kaydedilmez**
- Tüm tarama işlemleri anlık yapılır
- Log kayıtları tutulmaz
- Üçüncü parti ile veri paylaşımı yapılmaz
- HTTPS üzerinden güvenli bağlantı

## 📖 Kullanım

1. Ana sayfada e-posta adresinizi girin
2. "Ayak İzimi Tara" butonuna tıklayın
3. Tarama sürecini izleyin (3 kaynak)
4. Detaylı raporu inceleyin
5. Güvenlik önerilerini okuyun

## 🤝 API Kaynakları

Bu proje aşağıdaki açık kaynak API'leri kullanır:

- [XposedOrNot](https://xposedornot.com) - Veri sızıntısı kontrolü
- [LeakIX](https://leakix.net) - Güvenlik açıkları
- [Gravatar](https://gravatar.com) - Profil bilgileri

## 📝 Lisans

MIT License - [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! İşte nasıl yapabilirsiniz:

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yenilik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yenilik`)
5. Pull Request açın

### Katkı Rehberi

- Kod standartlarına uyun (ESLint + Prettier)
- TypeScript kullanın
- Commit mesajlarını anlamlı yazın
- Test ekleyin (varsa)

## 🐛 Hata Bildirimi

Bir hata mı buldunuz? [Issue açın](https://github.com/swordofyzc/dijital-ayak-izi/issues)

## 📧 İletişim

- GitHub: [@swordofyzc](https://github.com/swordofyzc)
- Proje: [dijital-ayak-izi](https://github.com/swordofyzc/dijital-ayak-izi)

## ⭐ Destek

Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐

## 📚 Dökümantasyon

### Proje Yapısı
```
dijital-ayak-izi/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Ana sayfalar
│   ├── services/      # API servisleri
│   └── types/         # TypeScript types
├── server/
│   └── index.js       # Express backend
└── public/            # Static files
```

### API Endpoints

**POST /api/scan**
- Body: `{ email: string }`
- Response: ScanResult object

## 🔮 Gelecek Özellikler

- [ ] Email bildirim sistemi
- [ ] Periyodik tarama (şifre yöneticisi gibi)
- [ ] Dark mode
- [ ] Çoklu email desteği
- [ ] PDF rapor export
- [ ] İstatistik dashboard

## 💡 İlham Kaynakları

- [Have I Been Pwned](https://haveibeenpwned.com)
- Apple Design Guidelines
- Modern web security best practices

---

**Not**: Bu proje eğitim ve farkındalık amaçlıdır. Gerçek güvenlik analizi için profesyonel araçlar kullanın.

**Geliştirici**: [@swordofyzc](https://github.com/swordofyzc) | **Yıl**: 2025

---

Made with ❤️ and ☕ in Turkey 🇹🇷
