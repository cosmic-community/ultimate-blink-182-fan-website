import { Metadata } from 'next'
import { getSongs } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Songs - blink-182 Greatest Hits & Deep Cuts',
  description: 'Discover the complete collection of blink-182 songs, from chart-topping hits to fan favorites. Read lyrics, fun facts, and watch music videos.',
}

export default async function SongsPage() {
  const songs = await getSongs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Songs
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            From anthems to deep cuts - explore the complete blink-182 songbook
          </p>
        </div>
      </section>

      {/* Songs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {songs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {songs.map((song) => (
                <div key={song.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                  <div className="p-8">
                    {/* Song Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {song.metadata?.theme?.value && (
                            <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {song.metadata.theme.value}
                            </span>
                          )}
                          {song.metadata?.length && (
                            <span className="text-gray-500 text-sm">
                              {song.metadata.length}
                            </span>
                          )}
                        </div>

                        <h2 className="text-3xl font-bold mb-2 text-gray-900">
                          {song.metadata?.title || song.title}
                        </h2>

                        <div className="flex flex-col gap-1 text-gray-600">
                          {song.metadata?.album?.metadata?.title && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Album:</span>
                              <span className="font-medium text-primary">
                                {song.metadata.album.metadata.title}
                              </span>
                              {song.metadata.album.metadata.release_date && (
                                <span className="text-sm text-gray-500">
                                  ({new Date(song.metadata.album.metadata.release_date).getFullYear()})
                                </span>
                              )}
                            </div>
                          )}
                          {song.metadata?.writers && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Writers:</span>
                              <span className="text-sm">{song.metadata.writers}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Album Art */}
                      {song.metadata?.album?.metadata?.album_art?.imgix_url && (
                        <div className="flex-shrink-0 ml-6">
                          <img
                            src={`${song.metadata.album.metadata.album_art.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                            alt={song.metadata.album.metadata.title}
                            className="w-20 h-20 rounded-lg shadow-md"
                            width={80}
                            height={80}
                          />
                        </div>
                      )}
                    </div>

                    {/* Lyrics Preview */}
                    {song.metadata?.lyrics && (
                      <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3">Lyrics</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-gray-700 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                            {song.metadata.lyrics.split('\n').slice(0, 8).join('\n')}
                            {song.metadata.lyrics.split('\n').length > 8 && '\n...'}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Fun Facts */}
                    {song.metadata?.fun_facts && (
                      <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3">Fun Facts</h3>
                        <div 
                          className="text-gray-700 prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: song.metadata.fun_facts }}
                        />
                      </div>
                    )}

                    {/* Music Video */}
                    {song.metadata?.music_video && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Music Video Available</span>
                        <a
                          href={song.metadata.music_video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Watch on YouTube
                        </a>
                      </div>
                    )}
                  </div>
                </div>
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