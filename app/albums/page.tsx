import { Metadata } from 'next'
import { getAlbums } from '@/lib/cosmic'
import FeaturedAlbums from '@/components/FeaturedAlbums'

export const metadata: Metadata = {
  title: 'Albums - blink-182 Discography',
  description: 'Explore the complete blink-182 discography including Enema of the State, Take Off Your Pants and Jacket, and more iconic albums.',
}

export default async function AlbumsPage() {
  const albums = await getAlbums()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Complete Discography
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Journey through every album, from garage punk beginnings to pop-punk perfection
          </p>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover punk-border"
                >
                  <div className="aspect-square overflow-hidden">
                    {album.metadata?.album_art?.imgix_url ? (
                      <img
                        src={`${album.metadata.album_art.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                        alt={album.metadata.title || album.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold">
                          {album.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {album.metadata?.title || album.title}
                    </h3>
                    
                    <div className="flex justify-between items-center mb-4">
                      {album.metadata?.release_date && (
                        <p className="text-gray-600">
                          {new Date(album.metadata.release_date).getFullYear()}
                        </p>
                      )}
                      {album.metadata?.record_label && (
                        <p className="text-sm text-gray-500">
                          {album.metadata.record_label}
                        </p>
                      )}
                    </div>

                    {album.metadata?.album_story && (
                      <div 
                        className="text-gray-600 text-sm mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ 
                          __html: album.metadata.album_story.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        }}
                      />
                    )}

                    {album.metadata?.era?.value && (
                      <span className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {album.metadata.era.value}
                      </span>
                    )}

                    {album.metadata?.chart_performance && (
                      <div className="text-xs text-gray-500">
                        {album.metadata.chart_performance.split('\n')[0]}
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