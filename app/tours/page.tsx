import { Metadata } from 'next'
import { getTours } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Tours - blink-182 Live History',
  description: 'Explore the epic touring history of blink-182, from legendary co-headlining tours to intimate venue shows that defined pop-punk live music.',
}

export default async function ToursPage() {
  const tours = await getTours()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tours
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Legendary live performances and epic touring moments from blink-182
          </p>
        </div>
      </section>

      {/* Tours */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {tours.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-12">
              {tours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                  <div className="flex flex-col lg:flex-row">
                    {/* Tour Poster */}
                    {tour.metadata?.tour_poster?.imgix_url && (
                      <div className="lg:w-1/3 flex-shrink-0">
                        <img
                          src={`${tour.metadata.tour_poster.imgix_url}?w=600&h=800&fit=crop&auto=format,compress`}
                          alt={`${tour.metadata.tour_name} poster`}
                          className="w-full h-64 lg:h-full object-cover"
                          width={300}
                          height={400}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-8">
                      {/* Year Badge */}
                      {tour.metadata?.year && (
                        <span className="inline-block bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
                          {tour.metadata.year}
                        </span>
                      )}

                      {/* Tour Name */}
                      <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                        {tour.metadata?.tour_name || tour.title}
                      </h2>

                      {/* Description */}
                      {tour.metadata?.tour_description && (
                        <div 
                          className="text-gray-700 mb-6 prose"
                          dangerouslySetInnerHTML={{ __html: tour.metadata.tour_description }}
                        />
                      )}

                      {/* Special Guests */}
                      {tour.metadata?.special_guests && (
                        <div className="mb-6">
                          <h3 className="font-bold text-lg mb-2">Special Guests</h3>
                          <p className="text-gray-700">{tour.metadata.special_guests}</p>
                        </div>
                      )}

                      {/* Notable Venues */}
                      {tour.metadata?.notable_venues && (
                        <div className="mb-6">
                          <h3 className="font-bold text-lg mb-2">Notable Venues</h3>
                          <div className="text-gray-700 whitespace-pre-line">
                            {tour.metadata.notable_venues}
                          </div>
                        </div>
                      )}

                      {/* Highlights */}
                      {tour.metadata?.highlights && (
                        <div className="bg-primary bg-opacity-5 p-4 rounded-lg border-l-4 border-primary">
                          <h3 className="font-bold text-lg mb-3 text-primary">Tour Highlights</h3>
                          <div className="text-gray-700 whitespace-pre-line">
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