import { Metadata } from 'next'
import { spotifyAPI } from '@/lib/spotify'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import { getSongs } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Music - blink-182 Spotify Integration',
  description: 'Listen to blink-182 music directly from Spotify with our integrated music player.',
}

export default async function MusicPage() {
  // Get songs from Cosmic to display alongside Spotify integration
  const songs = await getSongs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Music Player
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Listen to blink-182's greatest hits directly from Spotify
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Spotify Player */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">
                <span className="text-gradient">Spotify Integration</span>
              </h2>
              <SpotifyPlayer searchQuery="blink-182" className="sticky top-4" />
            </div>

            {/* Song Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">
                <span className="text-gradient">Song Details</span>
              </h2>
              
              {songs.length > 0 ? (
                <div className="space-y-6">
                  {songs.slice(0, 10).map((song) => (
                    <div key={song.id} className="bg-white rounded-lg shadow-lg p-6 card-hover">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {song.metadata?.title || song.title}
                        </h3>
                        {song.metadata?.length && (
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {song.metadata.length}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {song.metadata?.album && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Album:</span> {song.metadata.album.title}
                          </p>
                        )}
                        
                        {song.metadata?.writers && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Writers:</span> {song.metadata.writers}
                          </p>
                        )}
                        
                        {song.metadata?.theme?.value && (
                          <span className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            {song.metadata.theme.value}
                          </span>
                        )}
                      </div>
                      
                      {song.metadata?.fun_facts && (
                        <div 
                          className="mt-4 text-sm text-gray-700 prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: song.metadata.fun_facts }}
                        />
                      )}
                      
                      {song.metadata?.music_video && (
                        <div className="mt-4">
                          <a
                            href={song.metadata.music_video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-primary-600 font-medium text-sm"
                          >
                            Watch Music Video
                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                              <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-gray-600 mb-4">
                    No Song Details Available
                  </h3>
                  <p className="text-gray-500">
                    Song information will be displayed here once available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}