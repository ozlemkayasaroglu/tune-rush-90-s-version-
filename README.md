# 🎵 Tune Rush - Türkçe Rap Quiz Oyunu

Tune Rush, Türkçe rap müzik bilginizi test edebileceğiniz interaktif bir quiz oyunudur. Deezer API'si üzerinden rastgele Türkçe rap şarkıları getirir ve kullanıcıya 4 şık sunar.


## 🎮 Oyun Özellikleri

- 10 soruluk quiz formatı
- Her soru için 15 saniye süre
- 3 pas hakkı
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
tune-rush/
├── app/
│   ├── components/
│   │   └── RandomMusic.tsx    # Ana oyun bileşeni
│   ├── api/
│   │   └── random-music/     # Deezer API entegrasyonu
│   ├── types/                # TypeScript tip tanımlamaları
│   ├── utils/                # Yardımcı fonksiyonlar
│   ├── layout.tsx           # Ana sayfa layoutu
│   └── page.tsx             # Ana sayfa
├── public/                  # Statik dosyalar
└── package.json            # Bağımlılıklar ve scriptler
```

### Önemli Bileşenler

#### RandomMusic.tsx
Ana oyun mantığını içeren bileşen:
- Soru yönetimi
- Süre kontrolü
- Kullanıcı etkileşimleri
- Animasyon ve geçişler
- Puan hesaplama

```typescript
interface Track {
  id: string;
  title: string;
  thumbnail: string;
  preview: string;
  artist: string;
  album: string;
}

interface QuizQuestion {
  correctTrack: Track;
  options: {
    title: string;
    artist: string;
  }[];
  correctIndex: number;
}
```

### Özellik Detayları

#### Süre Yönetimi
```typescript
const [timeLeft, setTimeLeft] = useState<number>(15);
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (isActive && timeLeft > 0) {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  }
}, [isActive, timeLeft]);
```

#### Albüm Kapağı Blur Efekti
```typescript
<img
  src={question.correctTrack.thumbnail}
  alt="Şarkı Kapağı"
  className={`w-full h-full object-cover transition-all duration-1000 ${
    selectedAnswer === null ? 'blur-xl' : 'blur-none'
  }`}
/>
```

#### Pas Hakkı Sistemi
```typescript
const [skipCount, setSkipCount] = useState(3);

const handleSkip = () => {
  if (skipCount > 0 && !loading && selectedAnswer === null) {
    setSkipCount(prev => prev - 1);
    getRandomMusic();
  }
};
```

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/AtaKNY/tune-rush.git
```

2. Bağımlılıkları yükleyin:
```bash
cd tune-rush
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

## 🎯 Gelecek Özellikler

- [ ] Çoklu oyuncu modu
- [ ] Farklı müzik kategorileri
- [ ] Zorluk seviyeleri
- [ ] Liderlik tablosu
- [ ] Sosyal medya paylaşımı

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## ⚠️ Bilinen Sorunlar

- **Mobil Ses Sorunu**: Bazı mobil tarayıcılarda güvenlik politikaları nedeniyle otomatik ses çalma özelliği çalışmayabilir.
- Sorunu çözmek için yukarıdaki önerileri deneyebilir veya masaüstü bir tarayıcı kullanabilirsiniz.

