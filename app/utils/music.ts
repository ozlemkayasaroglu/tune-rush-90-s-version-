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

// Türkçe müzik türleri ve anahtar kelimeler
const turkishMusicKeywords = [
  'türkçe rap',
  'türk rap',
  'turkish rap',
  'türkçe hip hop'
];

// Rap sanatçıları
const rapArtists = [
  'Ceza',
  'Sagopa Kajmer',
  'Şehinşah',
  'Ezhel',
  'Ben Fero',
  'Norm Ender',
  'Contra',
  'Allame',
  'Şanışer',
  'Defkhan',
  'Pit10',
  'Hidra',
  'Joker',
  'No.1',
  'Rota',
  'Server Uraz',
  'Stabil',
  'Summer Cem',
  'Tankurt Manas',
  'UZI'
];

// Filtrelenecek kelimeler
const excludedWords = [
  'remix',
  'mix',
  'cover',
  'karaoke',
  'instrumental',
  'soundtrack',
  'english',
  'ingilizce',
  'çocuk',
  'bebek',
  'ninni',
  'kids',
  'baby',
  'lullaby'
];

function isTurkishTitle(title: string, artist: string): boolean {
  const combinedText = `${title} ${artist}`.toLowerCase();
  
  // Filtrelenecek kelimeleri kontrol et
  if (excludedWords.some(word => combinedText.includes(word))) {
    return false;
  }

  // Türkçe karakterler içeriyor mu kontrol et
  const turkishChars = ['ç', 'ğ', 'ı', 'ö', 'ş', 'ü', 'â', 'î', 'û'];
  if (turkishChars.some(char => combinedText.includes(char))) {
    return true;
  }

  // En az bir Türkçe kelime içeriyor mu kontrol et
  const turkishWords = ['bir', 've', 'ile', 'bu', 'sen', 'ben', 'aşk', 'sevda', 'yürek', 'gönül', 'hayat'];
  return turkishWords.some(word => combinedText.includes(word));
}

async function searchDeezer(query: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=50&output=json`
    );

    if (!response.ok) {
      throw new Error('API isteği başarısız oldu');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Deezer arama hatası:', error);
    return [];
  }
}

async function getSimilarTracks(artist: string, excludeTitle: string): Promise<{title: string, artist: string}[]> {
  try {
    // Sanatçının diğer şarkılarını ara
    const artistTracks = await searchDeezer(artist);
    
    // Benzer şarkıları filtrele
    const similarTracks = artistTracks
      .filter((track: any) => 
        track.type === 'track' &&
        track.title !== excludeTitle &&
        isTurkishTitle(track.title, track.artist.name)
      )
      .map((track: any) => ({
        title: track.title,
        artist: track.artist.name
      }));

    // Rastgele 3 şarkı seç
    return shuffleArray(similarTracks).slice(0, 3);
  } catch (error) {
    console.error('Benzer şarkı arama hatası:', error);
    return [];
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getRandomTurkishMusic(): Promise<QuizQuestion> {
  try {
    // Rastgele bir rap sanatçısı seç
    const randomArtist = rapArtists[Math.floor(Math.random() * rapArtists.length)];
    
    // Sanatçının şarkılarını ara
    const tracks = await searchDeezer(randomArtist);
    
    // Uygun şarkıları filtrele
    const turkishTracks = tracks.filter((track: any) => 
      track.preview && 
      track.type === 'track' &&
      track.title.length < 50 &&
      isTurkishTitle(track.title, track.artist.name) &&
      !excludedWords.some(word => track.title.toLowerCase().includes(word))
    );

    if (turkishTracks.length > 0) {
      // Rastgele bir şarkı seç
      const randomTrack = turkishTracks[Math.floor(Math.random() * turkishTracks.length)];
      
      // Doğru cevabı oluştur
      const correctTrack: Track = {
        id: randomTrack.id.toString(),
        title: randomTrack.title,
        thumbnail: randomTrack.album.cover_medium,
        preview: randomTrack.preview,
        artist: randomTrack.artist.name,
        album: randomTrack.album.title
      };

      // Benzer şarkıları al
      const similarTracks = await getSimilarTracks(randomTrack.artist.name, randomTrack.title);
      
      // Tüm seçenekleri oluştur
      const allOptions = [
        { title: correctTrack.title, artist: correctTrack.artist },
        ...similarTracks
      ];

      // Seçenekleri karıştır
      const shuffledOptions = shuffleArray(allOptions);
      
      // Doğru cevabın yeni indexini bul
      const correctIndex = shuffledOptions.findIndex(
        option => option.title === correctTrack.title && option.artist === correctTrack.artist
      );

      return {
        correctTrack,
        options: shuffledOptions,
        correctIndex
      };
    }

    throw new Error('Hiçbir şarkı bulunamadı! Lütfen tekrar deneyin.');
  } catch (error) {
    console.error('Şarkı getirme hatası:', error);
    throw error;
  }
} 