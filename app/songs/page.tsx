import { Metadata } from 'next'
import Link from 'next/link'
import { getSongs } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Songs - blink-182 Complete Catalog',
  description: 'Browse the complete blink-182 song catalog with lyrics, music videos, and fun facts about your favorite tracks.',
}

export default async function SongsPage() {
  const songs = await getSongs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Song Catalog
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Every song, every lyric, every story behind the music
          </p>
        </div>
      </section>

      {/* Songs List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {songs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {songs.map((song, index) => (
                <Link key={song.id} href={`/songs/${song.slug}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 card-hover border-l-4 border-primary">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors duration-300">
                          {song.metadata?.title || song.title}
                        </h3>
                        
                        {song.metadata?.album?.title && (
                          <p className="text-gray-600 text-sm">
                            from <em>{song.metadata.album.title}</em>
                          </p>
                        )}
                      </div>
                      
                      {song.metadata?.length && (
                        <span className="text-primary font-medium text-sm bg-primary bg-opacity-10 px-2 py-1 rounded">
                          {song.metadata.length}
                        </span>
                      )}
                    </div>

                    {song.metadata?.writers && (
                      <p className="text-gray-500 text-sm mb-3">
                        Written by {song.metadata.writers}
                      </p>
                    )}

                    {song.metadata?.lyrics && (
                      <div className="text-gray-600 text-sm mb-4 italic line-clamp-2">
                        "{song.metadata.lyrics.split('\n')[0]}"
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {song.metadata?.theme?.value && (
                        <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          {song.metadata.theme.value}
                        </span>
                      )}

                      {song.metadata?.music_video && (
                        <span className="inline-flex items-center text-primary text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Songs Available
              </h2>
              <p className="text-gray-500">
                Song information will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}