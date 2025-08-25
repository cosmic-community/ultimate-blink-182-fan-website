export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album?: string;
  albumArt?: string;
  spotifyUrl?: string;
  previewUrl?: string;
  duration?: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyApiTrack[];
  };
}

interface SpotifyApiTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  duration_ms: number;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Get Spotify access token using client credentials flow
async function getSpotifyAccessToken(): Promise<string | null> {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    console.warn('Spotify credentials not configured');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify token');
    }

    const data: SpotifyTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
}

// Search for a track on Spotify
export async function getSpotifyTrack(trackName: string, artistName: string): Promise<SpotifyTrack | undefined> {
  // Fix: Handle null token case properly
  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    console.warn('Could not obtain Spotify access token');
    return undefined;
  }

  try {
    const query = encodeURIComponent(`track:"${trackName}" artist:"${artistName}"`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data: SpotifySearchResponse = await response.json();
    
    if (data.tracks.items.length === 0) {
      return undefined;
    }

    const track = data.tracks.items[0];
    
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url || undefined,
      duration: track.duration_ms
    };
  } catch (error) {
    console.error('Error fetching Spotify track:', error);
    return undefined;
  }
}

// Get multiple tracks for an album
export async function getSpotifyAlbumTracks(albumName: string, artistName: string): Promise<SpotifyTrack[]> {
  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    return [];
  }

  try {
    const query = encodeURIComponent(`album:"${albumName}" artist:"${artistName}"`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data: SpotifySearchResponse = await response.json();
    
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url || undefined,
      duration: track.duration_ms
    }));
  } catch (error) {
    console.error('Error fetching Spotify album tracks:', error);
    return [];
  }
}