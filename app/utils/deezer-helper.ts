export async function getDeezerTrackId(shareUrl: string): Promise<string | null> {
  try {
    // Follow the redirect to get the final URL
    const response = await fetch(shareUrl, {
      method: 'HEAD',
      redirect: 'follow'
    });
    
    // Get the final URL after redirects
    const finalUrl = response.url;
    
    // Extract the track ID from the final URL
    // Example final URL: https://www.deezer.com/track/123456789
    const match = finalUrl.match(/track\/(\d+)/);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Deezer track ID:', error);
    return null;
  }
}

// Example usage:
// const trackId = await getDeezerTrackId('https://dzr.page.link/rGiAXNYawpubZaSY6'); 