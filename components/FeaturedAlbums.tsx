'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Album } from '@/types'

interface FeaturedAlbumsProps {
  albums: Album[]
}

export default function FeaturedAlbums({ albums }: FeaturedAlbumsProps) {
  if (!albums || albums.length === 0) {
    return (
      <section className="py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Featured Albums</h2>
          <p className="text-gray-600">Albums coming soon.</p>
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
          <span className="text-gradient">Featured Albums</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Essential releases that defined the blink-182 sound and shaped pop-punk history
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group"
          >
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

              {/* Album Title */}
              <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                {album.metadata?.title || album.title}
              </h3>

              {/* Release Info */}
              <div className="flex items-center gap-3 text-gray-600 text-sm mb-4">
                {album.metadata?.release_date && (
                  <span>{new Date(album.metadata.release_date).getFullYear()}</span>
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
                    __html: album.metadata.album_story.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                  }}
                />
              )}

              {/* Track Count & Producer */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                {album.metadata?.track_listing && (
                  <span>{album.metadata.track_listing.length} tracks</span>
                )}
                {album.metadata?.producer && (
                  <span>by {album.metadata.producer}</span>
                )}
              </div>

              {/* Chart Performance Preview */}
              {album.metadata?.chart_performance && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">
                    {album.metadata.chart_performance.split('\n')[0]}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <Link
          href="/albums"
          className="inline-flex items-center bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View All Albums
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}