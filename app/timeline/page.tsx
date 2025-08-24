import { Metadata } from 'next'
import { getTimelineEvents } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Timeline - blink-182 History',
  description: 'Follow the complete timeline of blink-182 from formation in 1992 to present day, including major milestones, albums, and band changes.',
}

export default async function TimelinePage() {
  const events = await getTimelineEvents()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Band Timeline
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            30+ years of pop-punk history, from garage band to global superstars
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {events.length > 0 ? (
            <div className="max-w-4xl mx-auto relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary opacity-30"></div>
              
              <div className="space-y-12">
                {events.map((event, index) => (
                  <div key={event.id} className="relative flex items-start gap-8">
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                        <span className="text-white font-bold text-sm">
                          {event.metadata?.date ? new Date(event.metadata.date).getFullYear() : ''}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 card-hover">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Text Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            {event.metadata?.event_type?.value && (
                              <span className="bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                                {event.metadata.event_type.value}
                              </span>
                            )}
                            {event.metadata?.date && (
                              <span className="text-gray-500 text-sm">
                                {new Date(event.metadata.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                            {event.metadata?.title || event.title}
                          </h3>
                          
                          {event.metadata?.description && (
                            <div 
                              className="text-gray-700 mb-6 prose"
                              dangerouslySetInnerHTML={{ __html: event.metadata.description }}
                            />
                          )}

                          {event.metadata?.significance && (
                            <div className="bg-primary bg-opacity-5 p-4 rounded-lg border-l-4 border-primary">
                              <p className="text-primary font-medium italic">
                                {event.metadata.significance}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Image */}
                        {event.metadata?.related_image?.imgix_url && (
                          <div className="lg:w-1/3 flex-shrink-0">
                            <img
                              src={`${event.metadata.related_image.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                              alt={event.metadata.title || event.title}
                              className="w-full h-48 lg:h-full object-cover rounded-lg shadow-md"
                              width={200}
                              height={150}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Timeline Events Available
              </h2>
              <p className="text-gray-500">
                Timeline events will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}