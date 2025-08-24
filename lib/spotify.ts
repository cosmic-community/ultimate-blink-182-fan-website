interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getSpotifyToken(): Promise<string | null> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn('Spotify credentials not configured');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      console.error('Failed to get Spotify token:', response.statusText);
      return null;
    }

    const data: SpotifyToken = await response.json();
    
    // Cache the token
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute early
    
    return cachedToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
}

export async function searchSpotifyTrack(query: string): Promise<SpotifyTrack | null> {
  const token = await getSpotifyToken();
  
  if (!token) {
    return null;
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      console.error('Spotify search failed:', response.statusText);
      return null;
    }

    const data: SpotifySearchResponse = await response.json();
    
    if (data.tracks.items.length === 0) {
      return null;
    }

    return data.tracks.items[0];
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
}

export async function getSpotifyEmbedUrl(trackId: string): Promise<string | null> {
  if (!trackId) {
    return null;
  }
  
  // Fixed: Ensure we return string | null consistently
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
}

export async function findBlinkTrackOnSpotify(songTitle: string): Promise<{
  embedUrl: string | null;
  track: SpotifyTrack | null;
}> {
  try {
    // Search for the track with "blink-182" to get more accurate results
    const searchQuery = `${songTitle} blink-182`;
    const track = await searchSpotifyTrack(searchQuery);
    
    if (!track) {
      return {
        embedUrl: null,
        track: null
      };
    }

    const embedUrl = await getSpotifyEmbedUrl(track.id);
    
    return {
      embedUrl,
      track
    };
  } catch (error) {
    console.error('Error finding blink-182 track on Spotify:', error);
    return {
      embedUrl: null,
      track: null
    };
  }
}