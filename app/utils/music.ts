import { QuizQuestion } from '../types/game';

// Track interface'ini types/game.ts'den import et
interface DeezerTrack {
  id: string;
  title: string;
  artist: string;
  preview: string;
  thumbnail: string;
  album: string;
  release_date: string;
  album_cover: string;
}

const pop90sArtists = [
  'Tarkan',
  'Sezen Aksu',
  'Levent Yüksel',
  'Sertab Erener',
  'Nilüfer',
  'Kenan Doğulu',
  'Barış Manço',
  'Ajda Pekkan',
  'Yonca Evcimik',
  'Nazan Öncel',
  'İzel',
  'Nükhet Duru',
  'Ebru Gündeş',
  'Burak Kut',
  'Mustafa Sandal'
];

const excludedWords = [
  'remix', 'mix', 'cover', 'karaoke', 'instrumental',
  'soundtrack', 'english', 'ingilizce',
  'çocuk', 'bebek', 'ninni', 'kids', 'baby', 'lullaby'
];

function isValidTitle(title: string, artist: string): boolean {
  const text = `${title} ${artist}`.toLowerCase();
  return !excludedWords.some(word => text.includes(word));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function searchDeezer(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=50&output=json`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Deezer API hatası:', error);
    return [];
  }
}

async function getSimilarTracks(artist: string, excludeTitle: string): Promise<{title: string, artist: string}[]> {
  const tracks = await searchDeezer(artist);
  return shuffleArray(
    tracks
      .filter((track: any) =>
        track.type === 'track' &&
        track.title !== excludeTitle &&
        isValidTitle(track.title, track.artist.name)
      )
      .map((track: any) => ({
        title: track.title,
        artist: track.artist.name
      }))
  ).slice(0, 3);
}

// 90'lar Türkçe Pop Sanatçıları
const TURKISH_ARTISTS = [
  'Tarkan',
  'Sezen Aksu',
  'Levent Yüksel',
  'Sertab Erener',
  'Nilüfer',
  'Kenan Doğulu',
  'Barış Manço',
  'Ajda Pekkan',
  'Yonca Evcimik',
  'Nazan Öncel',
  'Aşkın Nur Yengi',
  'Çelik',
  'İzel',
  'Burak Kut',
  'Mustafa Sandal',
  'Sibel Tüzün',
  'Emel Müftüoğlu',
  'Yıldız Tilbe',
  'Serdar Ortaç',
  'Hakan Peker',
  'Ebru Gündeş',
  'Seden Gürel',
  'Bendeniz',
  'Sibel Alaş',
  'Deniz Arcak',
  'Jale',
  'Nükhet Duru',
  'Fatih Erkoç',
  'Sibel Can',
  'Harun Kolçak',
  'Reyhan Karaca'
];

// 90'lar Türkçe Pop Şarkıları (Deezer ID'leri ile, güncel ve doğru)
export const TURKISH_SONGS = [
  {
    title: "Yaparım Bilirsin",
    artist: "Kenan Doğulu",
    deezerId: "144292330"
  },
  {
    title: "Bi' Daha",
    artist: "Levent Yüksel",
    deezerId: "66370316"
  },
  {
    title: "Aya Benzer",
    artist: "Mustafa Sandal",
    deezerId: "120665598"
  },
  {
    title: "Rakkas",
    artist: "Sezen Aksu",
    deezerId: "64074911"
  },
  {
    title: "Gamzelim",
    artist: "Serdar Ortaç",
    deezerId: "66134842"
  },
  {
    title: "Ele Güne Karşı",
    artist: "MFÖ",
    deezerId: "64366726"
  },
  {
    title: "Beni Unut",
    artist: "Serdar Ortaç",
    deezerId: "142353661"
  },
  {
    title: "Seni Yerler",
    artist: "Sezen Aksu",
    deezerId: "68334617"
  },
  {
    title: "Ölürüm Sana",
    artist: "Tarkan",
    deezerId: "16412332"
  },
  {
    title: "Aldatıldık",
    artist: "Rengin",
    deezerId: "78754720"
  },
  {
    title: "Mecbursun",
    artist: "Sertab Erener",
    deezerId: "66134978"
  },
  {
    title: "Ahmet",
    artist: "Deniz Seki",
    deezerId: "118007836"
  },
  {
    title: "Karamela",
    artist: "Hakan Peker",
    deezerId: "138675789"
  },
  {
    title: "Kuzu Kuzu",
    artist: "Tarkan",
    deezerId: "16412320"
  },
  {
    title: "Sen Başkasın",
    artist: "Tarkan",
    deezerId: "16412326"
  },
  {
    title: "Hovarda",
    artist: "Emel Müftüoğlu",
    deezerId: "93222982"
  },
  {
    title: "Sevdik Sevdalandık",
    artist: "Reyhan Karaca",
    deezerId: "105546612"
  },
  {
    title: "Anoni Niyolay",
    artist: "Volkan",
    deezerId: "66731225"
  },
  {
    title: "Dönence",
    artist: "Barış Manço",
    deezerId: "66133761"
  }
];

async function getTrackById(id: string): Promise<DeezerTrack | null> {
  try {
    const response = await fetch(`/api/deezer?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch track');
    }
    const data = await response.json();
    return {
      ...data,
      album: data.album ?? "",
      release_date: data.release_date ?? "",
      album_cover: data.album_cover ?? data.thumbnail ?? "",
    };
  } catch (error) {
    console.error('Şarkı getirme hatası:', error);
    return null;
  }
}

async function searchTrack(song: { title: string; artist: string; deezerId: string }): Promise<DeezerTrack | null> {
  try {
    // Önce ID ile şarkıyı bulmayı dene
    const track = await getTrackById(song.deezerId);
    if (track) {
      // ID ile bulunan şarkının doğruluğunu kontrol et
      const isExactMatch = 
        track.title.toLowerCase().includes(song.title.toLowerCase()) &&
        track.artist.toLowerCase().includes(song.artist.toLowerCase());
      
      if (isExactMatch) {
        return track;
      }
    }

    // ID ile bulunamazsa veya eşleşme yoksa, arama yap
    const searchResponse = await fetch(`/api/deezer?q=${encodeURIComponent(`${song.title} ${song.artist}`)}`);
    if (!searchResponse.ok) {
      throw new Error('Failed to search track');
    }
    const searchData = await searchResponse.json();

    if (searchData.data && searchData.data.length > 0) {
      // Tam eşleşme kontrolü - daha esnek
      const exactMatch = searchData.data.find((track: DeezerTrack) => {
        const trackTitle = track.title.toLowerCase();
        const trackArtist = track.artist.toLowerCase();
        const searchTitle = song.title.toLowerCase();
        const searchArtist = song.artist.toLowerCase();

        // Başlık ve sanatçı adının birbirini içermesi yeterli
        return (trackTitle.includes(searchTitle) || searchTitle.includes(trackTitle)) &&
               (trackArtist.includes(searchArtist) || searchArtist.includes(trackArtist));
      });

      if (exactMatch) {
        return exactMatch;
      }

      // Tam eşleşme yoksa, en yakın eşleşmeyi bul
      const bestMatch = searchData.data.reduce((best: DeezerTrack | null, current: DeezerTrack) => {
        if (!best) return current;

        const currentTitle = current.title.toLowerCase();
        const currentArtist = current.artist.toLowerCase();
        const searchTitle = song.title.toLowerCase();
        const searchArtist = song.artist.toLowerCase();

        // Mevcut en iyi eşleşme ile karşılaştır
        const currentScore = 
          (currentTitle.includes(searchTitle) ? 2 : 0) +
          (currentArtist.includes(searchArtist) ? 2 : 0) +
          (searchTitle.includes(currentTitle) ? 1 : 0) +
          (searchArtist.includes(currentArtist) ? 1 : 0);

        const bestScore = 
          (best.title.toLowerCase().includes(searchTitle) ? 2 : 0) +
          (best.artist.toLowerCase().includes(searchArtist) ? 2 : 0) +
          (searchTitle.includes(best.title.toLowerCase()) ? 1 : 0) +
          (searchArtist.includes(best.artist.toLowerCase()) ? 1 : 0);

        return currentScore > bestScore ? current : best;
      }, null);

      if (bestMatch) {
        return bestMatch;
      }
    }

    console.warn(`Şarkı bulunamadı: ${song.title} - ${song.artist}`);
    return null;
  } catch (error) {
    console.error('Şarkı arama hatası:', error);
    return null;
  }
}

export async function getRandom90sPopQuiz(): Promise<QuizQuestion> {
  try {
    // Rastgele bir şarkı seç
    const randomSong = TURKISH_SONGS[Math.floor(Math.random() * TURKISH_SONGS.length)];
    
    // Doğru şarkıyı bul
    const correctTrack = await searchTrack(randomSong);
    
    if (!correctTrack) {
      // Eğer şarkı bulunamazsa, başka bir şarkı dene
      return getRandom90sPopQuiz();
    }

    // Doğru şarkının bilgilerini güncelle
    correctTrack.title = randomSong.title;
    correctTrack.artist = randomSong.artist;
    correctTrack.album = correctTrack.album ?? "";
    correctTrack.release_date = correctTrack.release_date ?? "";
    
    // Yanlış cevaplar için rastgele şarkılar seç
    const wrongTracks: DeezerTrack[] = [];
    const usedIndices = new Set<number>();
    
    while (wrongTracks.length < 3) {
      const randomIndex = Math.floor(Math.random() * TURKISH_SONGS.length);
      if (!usedIndices.has(randomIndex) && TURKISH_SONGS[randomIndex].deezerId !== randomSong.deezerId) {
        const wrongSong = TURKISH_SONGS[randomIndex];
        const wrongTrack = await searchTrack(wrongSong);
        
        if (wrongTrack) {
          // Yanlış şarkının bilgilerini güncelle
          wrongTrack.title = wrongSong.title;
          wrongTrack.artist = wrongSong.artist;
          wrongTrack.album = wrongTrack.album ?? "";
          wrongTrack.release_date = wrongTrack.release_date ?? "";
          wrongTrack.album_cover = wrongTrack.album_cover ?? wrongTrack.thumbnail ?? "";
          wrongTracks.push(wrongTrack);
          usedIndices.add(randomIndex);
        }
      }
    }

    // Eğer yeterli yanlış cevap bulunamazsa, baştan başla
    if (wrongTracks.length < 3) {
      return getRandom90sPopQuiz();
    }

    // Fisher-Yates shuffle algoritması ile seçenekleri karıştır
    const allOptions = [
      correctTrack,
      ...wrongTracks.map(track => ({
        ...track,
        album: track.album ?? "",
        release_date: track.release_date ?? "",
        album_cover: track.album_cover ?? track.thumbnail ?? ""
      }))
    ].sort(() => Math.random() - 0.5);
    
    return {
      correctTrack: {
        ...correctTrack,
        album: correctTrack.album ?? "",
        release_date: correctTrack.release_date ?? "",
        album_cover: correctTrack.album_cover ?? correctTrack.thumbnail ?? ""
      },
      options: allOptions,
    };
  } catch (error) {
    console.error('Quiz oluşturulurken hata:', error);
    // Hata durumunda yeni bir quiz dene
    return getRandom90sPopQuiz();
  }
}

export const TURKISH_90S_POP = [
  {
    title: "Gülümse",
    artist: "Sezen Aksu",
    preview: "https://cdns-preview-9.dzcdn.net/stream/c-9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c-128.mp3",
    album: "Gülümse",
    release_date: "1991",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Şımarık",
    artist: "Tarkan",
    preview: "https://cdns-preview-8.dzcdn.net/stream/c-8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c-128.mp3",
    album: "Ölürüm Sana",
    release_date: "1997",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Kuzu Kuzu",
    artist: "Tarkan",
    preview: "https://cdns-preview-7.dzcdn.net/stream/c-7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c-128.mp3",
    album: "Karma",
    release_date: "2001",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Şıkıdım",
    artist: "Tarkan",
    preview: "https://cdns-preview-6.dzcdn.net/stream/c-6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c-128.mp3",
    album: "Ölürüm Sana",
    release_date: "1997",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Bebek",
    artist: "Sezen Aksu",
    preview: "https://cdns-preview-5.dzcdn.net/stream/c-5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c-128.mp3",
    album: "Bebek",
    release_date: "1991",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Aşk",
    artist: "Sezen Aksu",
    preview: "https://cdns-preview-4.dzcdn.net/stream/c-4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c-128.mp3",
    album: "Aşk",
    release_date: "1995",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Gülümse",
    artist: "Sezen Aksu",
    preview: "https://cdns-preview-3.dzcdn.net/stream/c-3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c-128.mp3",
    album: "Gülümse",
    release_date: "1991",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Şımarık",
    artist: "Tarkan",
    preview: "https://cdns-preview-2.dzcdn.net/stream/c-2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c-128.mp3",
    album: "Ölürüm Sana",
    release_date: "1997",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c/500x500-000000-80-0-0.jpg"
  },
  {
    title: "Kuzu Kuzu",
    artist: "Tarkan",
    preview: "https://cdns-preview-1.dzcdn.net/stream/c-1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c-128.mp3",
    album: "Karma",
    release_date: "2001",
    album_cover: "https://e-cdns-images.dzcdn.net/images/cover/1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c/500x500-000000-80-0-0.jpg"
  }
];
