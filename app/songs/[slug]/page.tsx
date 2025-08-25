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
      description: 'This song could not be found.',
    }
  }

  return {
    title: `${song.metadata?.title || song.title} - blink-182`,
    description: `Listen to ${song.metadata?.title || song.title} by blink-182. ${song.metadata?.fun_facts ? song.metadata.fun_facts.substring(0, 160) : ''}`,
  }
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params
  const song = await getSong(slug)

  if (!song) {
    notFound()
  }

  const songTitle = song.metadata?.title || song.title
  const albumTitle = song.metadata?.album?.metadata?.title || song.metadata?.album?.title
  const albumSlug = song.metadata?.album?.slug

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {songTitle}
            </h1>
            
            {albumTitle && (
              <div className="mb-8">
                <span className="text-lg text-white text-opacity-80">from </span>
                {albumSlug ? (
                  <Link 
                    href={`/albums/${albumSlug}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {albumTitle}
                  </Link>
                ) : (
                  <span className="text-xl font-semibold">{albumTitle}</span>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 text-sm text-white text-opacity-80">
              {song.metadata?.writers && (
                <span>Written by: {song.metadata.writers}</span>
              )}
              {song.metadata?.length && (
                <span>Length: {song.metadata.length}</span>
              )}
              {song.metadata?.theme?.value && (
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {song.metadata.theme.value}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Music Video */}
              {song.metadata?.music_video && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Music Video</h2>
                  <YouTubeEmbed 
                    videoUrl={song.metadata.music_video}
                    title={songTitle}
                    showTitle={false}
                  />
                </div>
              )}

              {/* Song Info */}
              <div className="space-y-8">
                {song.metadata?.fun_facts && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">About the Song</h3>
                    <div 
                      className="prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: song.metadata.fun_facts }}
                    />
                  </div>
                )}

                {song.metadata?.lyrics && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Lyrics</h3>
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                        {song.metadata.lyrics}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Album Info */}
            {song.metadata?.album && (
              <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Album Information</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {song.metadata.album.metadata?.album_art?.imgix_url && (
                    <img
                      src={`${song.metadata.album.metadata.album_art.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                      alt={albumTitle}
                      className="w-48 h-48 rounded-lg shadow-md mx-auto md:mx-0"
                      width={192}
                      height={192}
                    />
                  )}
                  <div className="flex-1 space-y-4">
                    <h4 className="text-xl font-bold text-gray-900">{albumTitle}</h4>
                    {song.metadata.album.metadata?.release_date && (
                      <p className="text-gray-600">
                        Released: {new Date(song.metadata.album.metadata.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    {song.metadata.album.metadata?.record_label && (
                      <p className="text-gray-600">Label: {song.metadata.album.metadata.record_label}</p>
                    )}
                    {song.metadata.album.metadata?.producer && (
                      <p className="text-gray-600">Producer: {song.metadata.album.metadata.producer}</p>
                    )}
                    {albumSlug && (
                      <Link 
                        href={`/albums/${albumSlug}`}
                        className="inline-flex items-center bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-600 transition-colors duration-300"
                      >
                        View Album
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}