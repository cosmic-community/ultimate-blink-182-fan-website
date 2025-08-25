// app/songs/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSong } from '@/lib/cosmic'
import YouTubeEmbed from '@/components/YouTubeEmbed'

interface SongPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const { slug } = await params
  const song = await getSong(slug)
  
  if (!song) {
    return {
      title: 'Song Not Found',
    }
  }

  return {
    title: `${song.metadata?.title || song.title} - blink-182`,
    description: `Listen to "${song.metadata?.title || song.title}" by blink-182. ${song.metadata?.fun_facts ? song.metadata.fun_facts.replace(/<[^>]*>/g, '').substring(0, 160) : 'One of blink-182\'s iconic tracks.'}`,
  }
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params
  const song = await getSong(slug)

  if (!song) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {song.metadata?.title || song.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-white text-opacity-90">
              {song.metadata?.album?.metadata?.title && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">From the album</span>
                  <Link 
                    href={`/albums/${song.metadata.album.slug}`}
                    className="font-bold hover:text-white transition-colors underline"
                  >
                    {song.metadata.album.metadata.title}
                  </Link>
                </div>
              )}
              
              {song.metadata?.length && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                  </svg>
                  <span>{song.metadata.length}</span>
                </div>
              )}
              
              {song.metadata?.writers && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Written by</span>
                  <span className="font-medium">{song.metadata.writers}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Music Video */}
              {song.metadata?.music_video && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Music Video</h2>
                  <YouTubeEmbed 
                    videoUrl={song.metadata.music_video}
                    title={`${song.metadata?.title || song.title} - blink-182`}
                    showTitle={false}
                  />
                </div>
              )}
              
              {/* Lyrics */}
              {song.metadata?.lyrics && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Lyrics</h2>
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm">
                      {song.metadata.lyrics}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Album Info */}
            {song.metadata?.album && (
              <div className="mt-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="md:flex">
                    {song.metadata.album.metadata?.album_art?.imgix_url && (
                      <div className="md:w-1/3">
                        <img
                          src={`${song.metadata.album.metadata.album_art.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                          alt={song.metadata.album.metadata.title}
                          className="w-full h-64 md:h-full object-cover"
                          width={300}
                          height={300}
                        />
                      </div>
                    )}
                    
                    <div className="p-8 md:w-2/3">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        From the Album
                      </h3>
                      
                      <Link 
                        href={`/albums/${song.metadata.album.slug}`}
                        className="text-3xl font-bold text-primary hover:text-primary-600 transition-colors mb-4 block"
                      >
                        {song.metadata.album.metadata?.title}
                      </Link>
                      
                      <div className="space-y-3 text-gray-600">
                        {song.metadata.album.metadata?.release_date && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Released:</span>
                            {new Date(song.metadata.album.metadata.release_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        
                        {song.metadata.album.metadata?.record_label && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Label:</span>
                            {song.metadata.album.metadata.record_label}
                          </p>
                        )}
                        
                        {song.metadata.album.metadata?.producer && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Producer:</span>
                            {song.metadata.album.metadata.producer}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <Link
                          href={`/albums/${song.metadata.album.slug}`}
                          className="inline-flex items-center bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          View Full Album
                          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fun Facts */}
            {song.metadata?.fun_facts && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Behind the Song</h2>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: song.metadata.fun_facts }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}