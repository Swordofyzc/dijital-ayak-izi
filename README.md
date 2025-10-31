🔥 YENİ README.md:
markdown# 🔍 Dijital Ayak İzi Tarayıcı

E-posta adresinizin bilinen veri sızıntılarında olup olmadığını kontrol edin. Modern, hızlı ve güvenli.

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-black)

## ✨ Özellikler

- 🚀 **Hızlı Tarama**: 3 farklı kaynaktan saniyeler içinde kapsamlı analiz
- 🔒 **100% Güvenli**: Verileriniz kaydedilmez, sadece anlık tarama yapılır
- 📊 **Detaylı Rapor**: Risk skoru ve kişiselleştirilmiş güvenlik önerileri
- 🎨 **Modern Tasarım**: Apple-inspired minimalist ve responsive arayüz
- 🇹🇷 **Türkçe Destek**: Tam Türkçe arayüz ve açıklamalar
- ⚡ **Gerçek Zamanlı**: Anlık tarama ve sonuç görüntüleme

## 🎯 Tarama Kaynakları

- **XposedOrNot**: 500+ veri sızıntısı veritabanı
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
- Vercel Serverless Functions
- Node.js
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

3. **Development modda çalıştırın**
```bash
npm run dev
```

4. **Tarayıcıda açın**
```
http://localhost:5173
```

## 🌐 Deploy (Vercel)

### Hızlı Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/swordofyzc/dijital-ayak-izi)

### Manuel Deploy

1. GitHub reposunu Vercel'e import edin
2. Deploy butonuna basın!

## 🎨 Ekran Görüntüleri

### Ana Sayfa
- Minimalist email input
- Apple-style tasarım
- Smooth animasyonlar

### Tarama Ekranı
- Gerçek zamanlı ilerleme
- Progress indicators
- 2 kaynak taraması

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
│   ├── pages/         # Ana sayfalar (Home, Scan, Report)
│   └── App.tsx        # Main app component
├── api/
│   └── scan.js        # Vercel Serverless Function
├── public/            # Static files
└── vercel.json        # Vercel configuration
```

### API Endpoints

**POST /api/scan**
- **Platform**: Vercel Serverless Function
- **Body**: `{ email: string }`
- **Response**: 
```json
{
  "email": "user@example.com",
  "breaches": ["Breach1", "Breach2"],
  "totalBreaches": 2,
  "gravatar": {...},
  "riskScore": 40
}
```

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