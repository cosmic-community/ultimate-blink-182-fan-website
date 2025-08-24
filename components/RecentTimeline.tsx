'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { TimelineEvent } from '@/types'

interface RecentTimelineProps {
  events: TimelineEvent[]
}

export default function RecentTimeline({ events }: RecentTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <section className="py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Recent Timeline</h2>
          <p className="text-gray-600">Timeline events coming soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">Band Timeline</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Key moments and milestones in the blink-182 journey
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex items-start gap-6 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              {/* Date */}
              <div className="flex-shrink-0 w-32 text-right">
                {event.metadata?.date && (
                  <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                    {new Date(event.metadata.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>

              {/* Timeline dot */}
              <div className="flex-shrink-0 relative">
                <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                {index !== events.length - 1 && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-primary bg-opacity-30"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white rounded-xl shadow-lg p-6 card-hover">
                <div className="flex items-start gap-4">
                  {event.metadata?.related_image?.imgix_url && (
                    <img
                      src={`${event.metadata.related_image.imgix_url}?w=200&h=150&fit=crop&auto=format,compress`}
                      alt={event.metadata.title || event.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      width={80}
                      height={80}
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {event.metadata?.event_type?.value && (
                        <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                          {event.metadata.event_type.value}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {event.metadata?.title || event.title}
                    </h3>
                    
                    {event.metadata?.description && (
                      <div 
                        className="text-gray-600 text-sm line-clamp-3 mb-3"
                        dangerouslySetInnerHTML={{ 
                          __html: event.metadata.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
                        }}
                      />
                    )}

                    {event.metadata?.significance && (
                      <p className="text-primary text-sm font-medium">
                        {event.metadata.significance.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center mt-12"
      >
        <Link
          href="/timeline"
          className="inline-flex items-center bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View Full Timeline
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}