# 🎵 Tune Rush - 90'lar Türkçe Pop Quiz Oyunu

Bu proje, [@AtaKNY/tune-rush](https://github.com/AtaKNY/tune-rush) projesinden ilham alınarak geliştirilmiştir.

Tune Rush, 90'lar Türkçe pop müzik bilginizi test edebileceğiniz interaktif bir quiz oyunudur. Deezer API'si üzerinden rastgele 90'lar Türkçe pop şarkıları getirir ve kullanıcıya 4 şık sunar.

## 🎮 Canlı Demo

Oyunu hemen oynamak için: [Tune Rush - 90'lar Versiyonu](https://tune-rush-90-s-version-elkh5ldgf-ozlemkayasaroglus-projects.vercel.app)

## 🎵 Oyun Özellikleri

- 10 soruluk quiz formatı
- Her soru için 15 saniye süre
- Puan sistemi ve başarı değerlendirmesi
- Şarkı önizleme özelliği
- Blur efektli albüm kapakları
- Doğru/yanlış cevap animasyonları
- Modern ve responsive tasarım

## 🛠️ Teknik Özellikler

### Kullanılan Teknolojiler

- **Frontend Framework**: Next.js 14
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Animasyon**: Framer Motion
- **API**: Deezer API
- **State Yönetimi**: React Hooks

### Proje Yapısı

```
tune-rush-90s/
├── app/
│   ├── components/
│   │   └── GameRoom.tsx    # Ana oyun bileşeni
│   ├── api/
│   │   └── deezer/        # Deezer API entegrasyonu
│   ├── types/             # TypeScript tip tanımlamaları
│   ├── utils/             # Yardımcı fonksiyonlar
│   ├── layout.tsx         # Ana sayfa layoutu
│   └── page.tsx           # Ana sayfa
├── public/                # Statik dosyalar
└── package.json          # Bağımlılıklar ve scriptler
```

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/ozlemkayasaroglu/tune-rush-90-s-version-.git
```

2. Bağımlılıkları yükleyin:
```bash
cd tune-rush-90-s-version-
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda açın:
```
http://localhost:3000
```

## 🚀 Deployment

Projeyi Vercel üzerinde deploy etmek için:

1. Vercel CLI'ı yükleyin:
```bash
npm i -g vercel
```

2. Projeyi deploy edin:
```bash
vercel deploy --prod
```

## 🎯 Gelecek Özellikler

- Çoklu oyuncu modu
- Farklı müzik kategorileri
- Zorluk seviyeleri
- Liderlik tablosu
- Sosyal medya paylaşımı

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## ⚠️ Bilinen Sorunlar

- **Mobil Ses Sorunu**: Bazı mobil tarayıcılarda güvenlik politikaları nedeniyle otomatik ses çalma özelliği çalışmayabilir.
- Sorunu çözmek için yukarıdaki önerileri deneyebilir veya masaüstü bir tarayıcı kullanabilirsiniz.

## 🙏 Özel Teşekkürler

Bu projenin geliştirilmesinde değerli katkıları ve destekleri için:

- [@AtaKNY/tune-rush](https://github.com/AtaKNY/tune-rush) projesine
- Tüm katkıda bulunanlara

içtenlikle teşekkür ederim. 🙌

