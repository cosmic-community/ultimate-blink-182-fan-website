import { Metadata } from 'next'
import Link from 'next/link'
import { getSongs } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Songs - blink-182 Complete Discography',
  description: 'Browse the complete blink-182 discography with lyrics, music videos, and song information for all their biggest hits and deep cuts.',
}

export default async function SongsPage() {
  const songs = await getSongs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            All Songs
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Explore the complete blink-182 catalog - from classic hits to hidden gems
          </p>
        </div>
      </section>

      {/* Songs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {songs.length > 0 ? (
            <>
              {/* Filter by videos */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/songs"
                    className="bg-primary text-white px-6 py-2 rounded-full font-medium"
                  >
                    All Songs ({songs.length})
                  </Link>
                  <Link
                    href="/videos"
                    className="bg-white text-primary border-2 border-primary px-6 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    With Videos ({songs.filter(s => s.metadata?.music_video).length})
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {songs.map((song) => (
                  <div key={song.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                    {/* Album Art */}
                    {song.metadata?.album?.metadata?.album_art?.imgix_url && (
                      <div className="aspect-square">
                        <img
                          src={`${song.metadata.album.metadata.album_art.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                          alt={song.metadata.album.metadata.title}
                          className="w-full h-full object-cover"
                          width={300}
                          height={300}
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex-1">
                          {song.metadata?.title || song.title}
                        </h3>
                        {song.metadata?.music_video && (
                          <div className="flex-shrink-0 ml-3">
                            <div className="bg-red-100 text-red-600 p-2 rounded-full" title="Has music video">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        {song.metadata?.album?.metadata?.title && (
                          <p className="text-gray-600">
                            <span className="font-medium">Album:</span> {song.metadata.album.metadata.title}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {song.metadata?.length && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {song.metadata.length}
                            </span>
                          )}
                          
                          {song.metadata?.theme?.value && (
                            <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {song.metadata.theme.value}
                            </span>
                          )}
                        </div>

                        {song.metadata?.writers && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Writers:</span> {song.metadata.writers}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/songs/${song.slug}`}
                          className="flex-1 bg-primary text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          View Details
                        </Link>
                        
                        {song.metadata?.music_video && (
                          <a
                            href={song.metadata.music_video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            title="Watch on YouTube"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Songs Available
              </h2>
              <p className="text-gray-500">
                Songs will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}