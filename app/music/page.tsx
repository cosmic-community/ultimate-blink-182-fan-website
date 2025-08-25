import { spotifyAPI } from '@/lib/spotify'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Music - blink-182 on Spotify',
  description: 'Listen to blink-182\'s complete discography on Spotify. Stream all their hits and discover deep cuts from the legendary pop-punk band.',
}

export default async function MusicPage() {
  let tracks = []
  let hasSpotifyConfig = false

  try {
    // Check if Spotify is configured
    if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
      hasSpotifyConfig = true
      tracks = await spotifyAPI.getBlinkTracks()
    }
  } catch (error) {
    console.error('Failed to fetch Spotify tracks:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Music on Spotify
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Stream the complete blink-182 discography and discover your favorite tracks
          </p>
        </div>
      </section>

      {/* Spotify Player */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {hasSpotifyConfig ? (
            <SpotifyPlayer 
              searchQuery="blink-182"
              className="max-w-4xl mx-auto" 
            />
          ) : (
            <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-lg p-8">
              <div className="text-6xl mb-6">🎵</div>
              <h2 className="text-2xl font-bold mb-4">Spotify Integration</h2>
              <p className="text-gray-600 mb-6">
                To enable Spotify music streaming, configure your Spotify API credentials in the environment variables.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-left">
                <p className="font-mono text-sm text-gray-700">
                  SPOTIFY_CLIENT_ID=your_client_id<br/>
                  SPOTIFY_CLIENT_SECRET=your_client_secret
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}