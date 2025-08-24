export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  duration_ms: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

class SpotifyAPI {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  async searchTracks(query: string): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search Spotify tracks');
      }

      const data: SpotifySearchResponse = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Spotify API error:', error);
      return [];
    }
  }

  async getTrack(id: string): Promise<SpotifyTrack | null> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify track');
      }

      const track: SpotifyTrack = await response.json();
      return track;
    } catch (error) {
      console.error('Spotify API error:', error);
      return null;
    }
  }

  async getBlinkTracks(): Promise<SpotifyTrack[]> {
    return this.searchTracks('blink-182');
  }
}

export const spotifyAPI = new SpotifyAPI();