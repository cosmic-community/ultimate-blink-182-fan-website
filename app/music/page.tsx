import { Metadata } from 'next'
import { Suspense } from 'react'
import { spotifyAPI } from '@/lib/spotify'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import { getSongs, getAlbums } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Music - blink-182 Songs & Albums',
  description: 'Listen to blink-182 music, explore albums, and discover their biggest hits on Spotify.',
}

async function MusicContent() {
  const [spotifyData, songs, albums] = await Promise.all([
    spotifyAPI.getBlink182Data(),
    getSongs(),
    getAlbums()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Music
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Listen to blink-182's biggest hits and explore their complete discography
          </p>
        </div>
      </section>

      {/* Spotify Top Tracks */}
      {spotifyData.topTracks.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-gradient">Top Tracks on Spotify</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Most popular blink-182 songs streaming now
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <SpotifyPlayer tracks={spotifyData.topTracks} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CMS Songs */}
      {songs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Featured Songs
              </h2>
              <p className="text-gray-600 text-lg">
                Deep dives into the stories behind the hits
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {songs.map((song) => (
                <div key={song.id} className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden card-hover">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {song.metadata?.title || song.title}
                        </h3>
                        {song.metadata?.album && (
                          <p className="text-primary font-medium">
                            from "{song.metadata.album.title}"
                          </p>
                        )}
                        {song.metadata?.length && (
                          <p className="text-gray-600 text-sm mt-1">
                            Duration: {song.metadata.length}
                          </p>
                        )}
                      </div>
                    </div>

                    {song.metadata?.lyrics && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Lyrics</h4>
                        <div className="bg-white p-4 rounded-lg text-sm text-gray-700 font-mono whitespace-pre-line max-h-40 overflow-y-auto">
                          {song.metadata.lyrics}
                        </div>
                      </div>
                    )}

                    {song.metadata?.fun_facts && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Fun Facts</h4>
                        <div 
                          className="text-gray-700 text-sm prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: song.metadata.fun_facts }}
                        />
                      </div>
                    )}

                    {song.metadata?.music_video && (
                      <div className="flex gap-3">
                        <a
                          href={song.metadata.music_video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          Watch Music Video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-gradient">Albums</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Complete discography from garage demos to stadium anthems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {albums.map((album) => (
                <div key={album.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                  {album.metadata?.album_art?.imgix_url && (
                    <img
                      src={`${album.metadata.album_art.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                      alt={album.metadata.title || album.title}
                      className="w-full h-64 object-cover"
                      width={300}
                      height={300}
                    />
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {album.metadata?.title || album.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {album.metadata?.release_date && (
                        <span>{new Date(album.metadata.release_date).getFullYear()}</span>
                      )}
                      {album.metadata?.record_label && (
                        <span>{album.metadata.record_label}</span>
                      )}
                    </div>

                    {album.metadata?.album_story && (
                      <div 
                        className="text-gray-700 text-sm mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ 
                          __html: album.metadata.album_story.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        }}
                      />
                    )}

                    {album.metadata?.track_listing && album.metadata.track_listing.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{album.metadata.track_listing.length} tracks</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default function MusicPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading music content...</p>
        </div>
      </div>
    }>
      <MusicContent />
    </Suspense>
  )
}