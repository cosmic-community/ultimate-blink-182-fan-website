import { Metadata } from 'next'
import { getTours } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Tours & Concerts - blink-182',
  description: 'Explore blink-182\'s tour history including the Pop Disaster Tour, reunion shows, and memorable concerts.',
}

export default async function ToursPage() {
  const tours = await getTours()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tours & Concerts
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Relive the epic shows and tours that brought blink-182 to fans worldwide
          </p>
        </div>
      </section>

      {/* Tours List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {tours.length > 0 ? (
            <div className="space-y-8">
              {tours.map((tour, index) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
                >
                  <div className="md:flex">
                    {/* Tour Poster */}
                    {tour.metadata?.tour_poster?.imgix_url && (
                      <div className="md:w-1/3">
                        <img
                          src={`${tour.metadata.tour_poster.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                          alt={tour.metadata.tour_name || tour.title}
                          className="w-full h-64 md:h-full object-cover"
                          width={300}
                          height={200}
                        />
                      </div>
                    )}

                    {/* Tour Info */}
                    <div className={`${tour.metadata?.tour_poster?.imgix_url ? 'md:w-2/3' : 'w-full'} p-8`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-3xl font-bold">
                          {tour.metadata?.tour_name || tour.title}
                        </h3>
                        {tour.metadata?.year && (
                          <span className="bg-primary text-white px-4 py-2 rounded-full font-bold">
                            {tour.metadata.year}
                          </span>
                        )}
                      </div>

                      {tour.metadata?.special_guests && (
                        <p className="text-gray-600 mb-4">
                          <strong>Special Guests:</strong> {tour.metadata.special_guests}
                        </p>
                      )}

                      {tour.metadata?.tour_description && (
                        <div 
                          className="text-gray-700 mb-6 prose"
                          dangerouslySetInnerHTML={{ __html: tour.metadata.tour_description }}
                        />
                      )}

                      {tour.metadata?.notable_venues && (
                        <div className="mb-6">
                          <h4 className="font-bold text-lg mb-2 text-primary">Notable Venues</h4>
                          <div className="text-gray-600 text-sm whitespace-pre-line">
                            {tour.metadata.notable_venues}
                          </div>
                        </div>
                      )}

                      {tour.metadata?.highlights && (
                        <div>
                          <h4 className="font-bold text-lg mb-2 text-primary">Tour Highlights</h4>
                          <div className="text-gray-600 text-sm whitespace-pre-line">
                            {tour.metadata.highlights}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Tours Available
              </h2>
              <p className="text-gray-500">
                Tour information will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}