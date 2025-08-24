import { Metadata } from 'next'
import { spotifyAPI } from '@/lib/spotify'
import { getSongs, getAlbums } from '@/lib/cosmic'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import type { Song, Album } from '@/types'

export const metadata: Metadata = {
  title: 'Music - blink-182 Discography',
  description: 'Explore the complete blink-182 discography including albums, singles, and popular tracks on Spotify.',
}

export default async function MusicPage() {
  const [songs, albums] = await Promise.all([
    getSongs(),
    getAlbums()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Music & Discography
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            From pop-punk anthems to experimental masterpieces - explore the complete blink-182 catalog
          </p>
        </div>
      </section>

      {/* Spotify Integration */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Listen on Spotify</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Stream the most popular blink-182 tracks
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SpotifyPlayer searchQuery="blink-182" />
          </div>
        </div>
      </section>

      {/* Albums Section */}
      {albums.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Albums</h2>
              <p className="text-gray-600 text-lg">Studio albums and major releases</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album: Album) => (
                <div key={album.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden card-hover">
                  {album.metadata?.album_art?.imgix_url && (
                    <img
                      src={`${album.metadata.album_art.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                      alt={album.metadata.title || album.title}
                      className="w-full aspect-square object-cover"
                      width={200}
                      height={200}
                    />
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {album.metadata?.title || album.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {album.metadata?.release_date && (
                        <span>
                          {new Date(album.metadata.release_date).getFullYear()}
                        </span>
                      )}
                      {album.metadata?.record_label && (
                        <span>{album.metadata.record_label}</span>
                      )}
                    </div>

                    {album.metadata?.album_story && (
                      <div 
                        className="text-gray-700 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{ 
                          __html: album.metadata.album_story.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Songs Section */}
      {songs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-gradient">Popular Songs</span>
              </h2>
              <p className="text-gray-600 text-lg">Fan favorites and chart toppers</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6">
                {songs.map((song: Song) => (
                  <div key={song.id} className="bg-white rounded-xl shadow-lg p-6 card-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">
                          {song.metadata?.title || song.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          {song.metadata?.album?.metadata?.title && (
                            <span>Album: {song.metadata.album.metadata.title}</span>
                          )}
                          {song.metadata?.length && (
                            <span>Duration: {song.metadata.length}</span>
                          )}
                          {song.metadata?.writers && (
                            <span>Writers: {song.metadata.writers}</span>
                          )}
                        </div>

                        {song.metadata?.fun_facts && (
                          <div 
                            className="text-gray-700 prose"
                            dangerouslySetInnerHTML={{ __html: song.metadata.fun_facts }}
                          />
                        )}
                      </div>

                      {song.metadata?.music_video && (
                        <div className="flex-shrink-0 ml-6">
                          <a
                            href={song.metadata.music_video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch Video
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}