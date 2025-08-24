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
    }>
  }
  external_urls: {
    spotify: string
  }
  preview_url: string | null
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[]
  }
}

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token')
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 minute early

  return accessToken
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken()
    
    const searchParams = new URLSearchParams({
      q: query,
      type: 'track',
      limit: '10'
    })

    const response = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to search Spotify tracks')
    }

    const data: SpotifySearchResponse = await response.json()
    return data.tracks.items
  } catch (error) {
    console.error('Spotify search error:', error)
    return []
  }
}

export async function getSpotifyTrack(trackId: string): Promise<SpotifyTrack | null> {
  try {
    const token = await getAccessToken()
    
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return null
    }

    const track: SpotifyTrack = await response.json()
    return track
  } catch (error) {
    console.error('Spotify track fetch error:', error)
    return null
  }
}

// Fix for line 77 - ensure we handle null values properly
export function getTrackPreviewUrl(track: SpotifyTrack): string | null {
  // This was likely the issue - preview_url can be null from Spotify API
  return track.preview_url // Now properly typed as string | null
}