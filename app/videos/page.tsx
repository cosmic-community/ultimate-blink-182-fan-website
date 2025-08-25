import { Metadata } from 'next'
import { getSongs } from '@/lib/cosmic'
import YouTubeEmbed from '@/components/YouTubeEmbed'

export const metadata: Metadata = {
  title: 'Music Videos - blink-182',
  description: 'Watch all blink-182 music videos, from classic hits like "All the Small Things" and "What\'s My Age Again?" to their latest releases.',
}

export default async function VideosPage() {
  const songs = await getSongs()
  
  // Filter songs that have music videos
  const songsWithVideos = songs.filter(song => song.metadata?.music_video)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Music Videos
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Watch the iconic music videos that defined pop-punk for a generation
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {songsWithVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {songsWithVideos.map((song) => (
                <div key={song.id} className="space-y-4">
                  <YouTubeEmbed 
                    videoUrl={song.metadata.music_video!}
                    title={`${song.metadata?.title || song.title} - blink-182`}
                    className="w-full"
                  />
                  
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {song.metadata?.title || song.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      {song.metadata?.album?.metadata?.title && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {song.metadata.album.metadata.title}
                        </span>
                      )}
                      
                      {song.metadata?.length && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                          </svg>
                          {song.metadata.length}
                        </span>
                      )}
                      
                      {song.metadata?.theme?.value && (
                        <span className="text-primary font-medium">
                          {song.metadata.theme.value}
                        </span>
                      )}
                    </div>

                    {song.metadata?.fun_facts && (
                      <div className="text-gray-600 text-sm">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: song.metadata.fun_facts.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Music Videos Available
              </h2>
              <p className="text-gray-500">
                Music videos will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {songsWithVideos.length > 0 && (
        <section className="py-16 bg-primary bg-opacity-10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Want to hear more?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore the complete discography and dive deeper into blink-182's musical journey
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/songs"
                className="inline-flex items-center bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Browse All Songs
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/albums"
                className="inline-flex items-center bg-white text-primary border-2 border-primary font-bold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View Albums
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}