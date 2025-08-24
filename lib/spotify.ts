const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  artists: SpotifyArtist[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export async function getSpotifyAccessToken(): Promise<string> {
  if (!client_id || !client_secret) {
    throw new Error('Spotify credentials not found');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data: SpotifyTokenResponse = await response.json();
  return data.access_token;
}

export async function searchSpotifyTrack(query: string): Promise<SpotifyTrack | null> {
  try {
    const token = await getSpotifyAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      console.error('Spotify API error:', response.status);
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

export async function getBlink182TopTracks(): Promise<SpotifyTrack[]> {
  try {
    const token = await getSpotifyAccessToken();
    
    // Search for blink-182's top tracks
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=artist:blink-182&type=track&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      console.error('Spotify API error:', response.status);
      return [];
    }

    const data: SpotifySearchResponse = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error fetching blink-182 tracks:', error);
    return [];
  }
}