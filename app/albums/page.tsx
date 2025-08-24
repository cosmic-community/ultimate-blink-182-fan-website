import { Metadata } from 'next'
import Link from 'next/link'
import { getAlbums } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Albums - Complete blink-182 Discography',
  description: 'Explore the complete discography of blink-182, from their breakthrough albums to latest releases. Listen to the evolution of pop-punk.',
}

export default async function AlbumsPage() {
  const albums = await getAlbums()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Albums
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            The complete blink-182 discography spanning decades of pop-punk evolution
          </p>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {albums.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {albums.map((album) => (
                <div key={album.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group">
                  {/* Album Art */}
                  {album.metadata?.album_art?.imgix_url && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${album.metadata.album_art.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                        alt={album.metadata.title || album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={400}
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Era Badge */}
                    {album.metadata?.era?.value && (
                      <span className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {album.metadata.era.value}
                      </span>
                    )}

                    {/* Album Info */}
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                      {album.metadata?.title || album.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {album.metadata?.release_date && (
                        <span>
                          {new Date(album.metadata.release_date).getFullYear()}
                        </span>
                      )}
                      {album.metadata?.record_label && (
                        <>
                          <span>•</span>
                          <span>{album.metadata.record_label}</span>
                        </>
                      )}
                    </div>

                    {/* Album Story Preview */}
                    {album.metadata?.album_story && (
                      <div 
                        className="text-gray-700 text-sm line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{ 
                          __html: album.metadata.album_story.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        }}
                      />
                    )}

                    {/* Track Count */}
                    {album.metadata?.track_listing && (
                      <div className="text-sm text-gray-600 mb-4">
                        {album.metadata.track_listing.length} tracks
                      </div>
                    )}

                    {/* Chart Performance */}
                    {album.metadata?.chart_performance && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Chart Performance:</h4>
                        <div className="text-xs text-gray-600 whitespace-pre-line">
                          {album.metadata.chart_performance.split('\n').slice(0, 2).join('\n')}
                        </div>
                      </div>
                    )}

                    {/* Producer */}
                    {album.metadata?.producer && (
                      <div className="text-sm text-gray-600">
                        Produced by <span className="font-medium">{album.metadata.producer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Albums Available
              </h2>
              <p className="text-gray-500">
                Album information will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}