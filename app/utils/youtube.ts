import { google } from 'googleapis';

const youtube = google.youtube('v3');

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

// Türkçe şarkı türleri
const turkishMusicKeywords = [
  'türkçe pop',
  'türk pop',
  'türkçe rock',
  'türk rock',
  'türkçe rap',
  'türk rap',
  'arabesk',
  'türk halk müziği',
  'türk sanat müziği'
];

export async function getRandomTurkishMusic(): Promise<YouTubeVideo> {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    throw new Error('YouTube API anahtarı bulunamadı!');
  }

  try {
    // Rastgele bir müzik türü seçiyoruz
    const randomGenre = turkishMusicKeywords[Math.floor(Math.random() * turkishMusicKeywords.length)];
    
    // Türkçe müzik için arama yapıyoruz
    const searchResponse = await youtube.search.list({
      key: API_KEY,
      part: ['snippet'],
      q: `${randomGenre} şarkı -mix -playlist -derleme -karaoke`,
      type: ['video'],
      videoCategoryId: '10', // Müzik kategorisi
      maxResults: 50,
      regionCode: 'TR',
      relevanceLanguage: 'tr',
      videoDefinition: 'high' as 'high',
      videoDuration: 'short' as 'short'
    });

    const items = searchResponse.data?.items || [];
    if (items.length === 0) {
      throw new Error('Hiç video bulunamadı!');
    }

    // Rastgele bir video seçiyoruz
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomVideo = items[randomIndex];

    return {
      id: randomVideo.id?.videoId || '',
      title: randomVideo.snippet?.title || '',
      thumbnail: randomVideo.snippet?.thumbnails?.medium?.url || ''
    };
  } catch (error) {
    console.error('YouTube API hatası:', error);
    throw new Error('Video getirme işlemi başarısız oldu!');
  }
} 