import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const trackId = searchParams.get('id');

  if (trackId) {
    try {
      const response = await fetch(
        `https://api.deezer.com/track/${trackId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Deezer API request failed');
      }

      const data = await response.json();
      
      // Türkçe şarkı kontrolü
      if (!data.artist.name || !data.title) {
        throw new Error('Invalid track data');
      }

      // Transform the response to match our Track interface
      const track = {
        id: data.id,
        title: data.title,
        artist: data.artist.name,
        preview: data.preview || null,
        thumbnail: data.album.cover_medium,
        album: data.album.title,
        release_date: data.release_date || data.album.release_date || null
      };

      // Preview URL'si geçerli değilse uyarı logla
      if (!track.preview) {
        console.warn(`Preview URL bulunamadı: ${data.title} - ${data.artist.name}`);
      }

      return NextResponse.json(track);
    } catch (error) {
      console.error('Deezer API error:', error);
      return NextResponse.json({ error: 'Failed to fetch track from Deezer API' }, { status: 500 });
    }
  }

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Türkçe şarkıları garantilemek için sorguya "türkçe" ekle
    const turkishQuery = `${query} türkçe`;
    
    // Türkiye lokasyonu ve 90'lar yılları için filtreleme
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(turkishQuery)}&limit=50&output=json&country=tr`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Deezer API request failed');
    }

    const data = await response.json();
    
    // Türkçe şarkıları filtrele
    const turkishTracks = data.data.filter((track: any) => {
      // Sanatçı adında Türkçe karakter kontrolü
      const hasTurkishChars = /[ğüşıöçĞÜŞİÖÇ]/.test(track.artist.name);
      // Şarkı adında Türkçe karakter kontrolü
      const hasTurkishTitle = /[ğüşıöçĞÜŞİÖÇ]/.test(track.title);
      
      return hasTurkishChars || hasTurkishTitle;
    });

    // 90'lar yılları için filtreleme (1990-1999)
    const tracks = turkishTracks
      .filter((track: any) => {
        const releaseYear = track.release_date ? parseInt(track.release_date.slice(0, 4)) : null;
        return releaseYear !== null && releaseYear >= 1990 && releaseYear <= 1999;
      })
      .map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        preview: track.preview || null,
        thumbnail: track.album.cover_medium,
        album: track.album.title,
        release_date: track.release_date || track.album.release_date || null
      }));

    // Preview URL'si olmayan şarkıları filtrele
    const validTracks = tracks.filter((track: any) => track.preview !== null);
    
    if (validTracks.length === 0) {
      console.warn('Hiç geçerli preview URL\'si olan Türkçe şarkı bulunamadı');
    }

    return NextResponse.json({ data: validTracks });
  } catch (error) {
    console.error('Deezer API error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Deezer API' }, { status: 500 });
  }
} 