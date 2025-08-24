// Spotify Track interface
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  popularity: number;
}

// Spotify API class
class SpotifyAPI {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiration: number = 0;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiration = Date.now() + (data.expires_in * 1000);
    
    return this.accessToken;
  }

  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search Spotify tracks');
      }

      const data = await response.json();
      return data.tracks.items as SpotifyTrack[];
    } catch (error) {
      console.error('Spotify search error:', error);
      return [];
    }
  }

  async getTrack(trackId: string): Promise<SpotifyTrack | null> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to get Spotify track');
      }

      const track = await response.json();
      return track as SpotifyTrack;
    } catch (error) {
      console.error('Spotify track fetch error:', error);
      return null;
    }
  }
}

// Export the API instance
export const spotifyAPI = new SpotifyAPI();

// Utility functions
export function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getArtistNames(artists: SpotifyTrack['artists']): string {
  return artists.map((artist) => artist.name).join(', ');
}