// Spotify API integration with proper TypeScript types and null safety

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  external_urls: {
    spotify: string
  }
  preview_url: string | null
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[]
    total: number
    limit: number
    offset: number
  }
}

interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: Array<{
    url: string
    height: number
    width: number
  }>
  external_urls: {
    spotify: string
  }
  followers: {
    total: number
  }
}

interface SpotifyArtistResponse {
  artists: {
    items: SpotifyArtist[]
  }
}

export interface SpotifyPlayerProps {
  searchQuery?: string
  className?: string
}

class SpotifyAPI {
  private accessToken: string | null = null
  private tokenExpires: number = 0

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpires) {
      return this.accessToken
    }

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials not configured')
    }

    const credentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.statusText}`)
    }

    const data: SpotifyTokenResponse = await response.json()
    
    this.accessToken = data.access_token
    this.tokenExpires = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 minute early
    
    return this.accessToken
  }

  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken()
      
      const searchParams = new URLSearchParams({
        q: query,
        type: 'track',
        limit: limit.toString()
      })

      const response = await fetch(`${SPOTIFY_API_BASE}/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Spotify search failed: ${response.statusText}`)
      }

      const data: SpotifySearchResponse = await response.json()
      return data.tracks.items || []
    } catch (error) {
      console.error('Spotify search error:', error)
      return []
    }
  }

  async searchArtists(query: string, limit: number = 10): Promise<SpotifyArtist[]> {
    try {
      const token = await this.getAccessToken()
      
      const searchParams = new URLSearchParams({
        q: query,
        type: 'artist',
        limit: limit.toString()
      })

      const response = await fetch(`${SPOTIFY_API_BASE}/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Spotify search failed: ${response.statusText}`)
      }

      const data: SpotifyArtistResponse = await response.json()
      return data.artists.items || []
    } catch (error) {
      console.error('Spotify artist search error:', error)
      return []
    }
  }

  async getBlinkTracks(): Promise<SpotifyTrack[]> {
    return this.searchTracks('artist:blink-182', 50)
  }
}

// Export singleton instance
export const spotifyAPI = new SpotifyAPI()

// Helper function to format track for display
export function formatTrackForDisplay(track: SpotifyTrack | undefined) {
  if (!track) {
    return {
      id: '',
      title: 'Unknown Track',
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: '0:00',
      image: '',
      spotifyUrl: '',
      previewUrl: null
    }
  }

  // Add explicit null checks for all potentially undefined properties
  const firstArtist = track.artists?.[0]
  const firstImage = track.album?.images?.[0]
  
  return {
    id: track.id || '',
    title: track.name || 'Unknown Track',
    artist: firstArtist?.name || 'Unknown Artist',
    album: track.album?.name || 'Unknown Album',
    duration: track.duration_ms ? formatDuration(track.duration_ms) : '0:00',
    image: firstImage?.url || '',
    spotifyUrl: track.external_urls?.spotify || '',
    previewUrl: track.preview_url || null
  }
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Export types
export type { SpotifyTrack, SpotifyArtist }