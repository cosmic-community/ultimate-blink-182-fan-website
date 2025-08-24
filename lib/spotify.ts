export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    name: string
  }>
  album: {
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  external_urls: {
    spotify: string
  }
  preview_url: string | null
  duration_ms: number
  popularity: number
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: Array<{
    name: string
  }>
  images: Array<{
    url: string
    height: number
    width: number
  }>
  external_urls: {
    spotify: string
  }
  release_date: string
  total_tracks: number
  tracks: {
    items: SpotifyTrack[]
  }
}

class SpotifyAPI {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || ''
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || ''
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token')
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 minute before expiry

    return this.accessToken
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const token = await this.getAccessToken()
    
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    return response.json()
  }

  async searchArtist(artistName: string): Promise<any> {
    const data = await this.makeRequest(`/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`)
    return data.artists.items[0] || null
  }

  async getArtistTopTracks(artistId: string, market: string = 'US'): Promise<SpotifyTrack[]> {
    const data = await this.makeRequest(`/artists/${artistId}/top-tracks?market=${market}`)
    return data.tracks || []
  }

  async getArtistAlbums(artistId: string, limit: number = 20): Promise<SpotifyAlbum[]> {
    const data = await this.makeRequest(`/artists/${artistId}/albums?include_groups=album,single&market=US&limit=${limit}`)
    return data.items || []
  }

  async getAlbum(albumId: string): Promise<SpotifyAlbum | null> {
    try {
      return await this.makeRequest(`/albums/${albumId}`)
    } catch (error) {
      return null
    }
  }

  async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    const data = await this.makeRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`)
    return data.tracks.items || []
  }

  // Get blink-182 specific data
  async getBlink182Data(): Promise<{
    artist: any
    topTracks: SpotifyTrack[]
    albums: SpotifyAlbum[]
  }> {
    try {
      const artist = await this.searchArtist('blink-182')
      
      if (!artist) {
        return { artist: null, topTracks: [], albums: [] }
      }

      const [topTracks, albums] = await Promise.all([
        this.getArtistTopTracks(artist.id),
        this.getArtistAlbums(artist.id, 50)
      ])

      return {
        artist,
        topTracks,
        albums
      }
    } catch (error) {
      console.error('Error fetching blink-182 Spotify data:', error)
      return { artist: null, topTracks: [], albums: [] }
    }
  }
}

export const spotifyAPI = new SpotifyAPI()