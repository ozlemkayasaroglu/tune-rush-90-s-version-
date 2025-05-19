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

export async function getRandom90sPopQuiz(): Promise<QuizQuestion> {
  try {
    const artist = pop90sArtists[Math.floor(Math.random() * pop90sArtists.length)];
    const tracks = await searchDeezer(artist);

    const validTracks = tracks.filter((track: any) =>
      track.preview &&
      track.type === 'track' &&
      isValidTitle(track.title, track.artist.name)
    );

    if (validTracks.length === 0) throw new Error('Uygun şarkı bulunamadı.');

    const selected = validTracks[Math.floor(Math.random() * validTracks.length)];

    const correctTrack: Track = {
      id: selected.id.toString(),
      title: selected.title,
      thumbnail: selected.album.cover_medium,
      preview: selected.preview,
      artist: selected.artist.name,
      album: selected.album.title
    };

    const distractors = await getSimilarTracks(correctTrack.artist, correctTrack.title);
    const allOptions = shuffleArray([
      { title: correctTrack.title, artist: correctTrack.artist },
      ...distractors
    ]);

    const correctIndex = allOptions.findIndex(
      opt => opt.title === correctTrack.title && opt.artist === correctTrack.artist
    );

    return {
      correctTrack,
      options: allOptions,
      correctIndex
    };
  } catch (err) {
    console.error('Quiz oluşturulamadı:', err);
    throw err;
  }
}
