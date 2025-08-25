'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import YouTubeEmbed from './YouTubeEmbed'
import type { Song } from '@/types'

interface PopularSongsProps {
  songs: Song[]
}

const featuredVideos = [
  {
    id: 'all-the-small-things',
    title: 'All the Small Things',
    url: 'https://www.youtube.com/watch?v=9Ht5RZpzPqw',
    slug: 'all-the-small-things'
  },
  {
    id: 'whats-my-age-again',
    title: "What's My Age Again?",
    url: 'https://www.youtube.com/watch?v=K7l5ZeVVoCA',
    slug: 'whats-my-age-again'
  }
]

export default function PopularSongs({ songs }: PopularSongsProps) {
  const displaySongs = songs.length > 0 ? songs.slice(0, 6) : []

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">Popular Songs</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          The hits that defined pop-punk and influenced a generation
        </p>
      </motion.div>

      {/* Featured Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {featuredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
          >
            <YouTubeEmbed 
              videoUrl={video.url}
              title={video.title}
              showTitle={false}
              className="p-6 pb-4"
            />
            <div className="px-6 pb-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{video.title}</h3>
              <Link
                href={`/songs/${video.slug}`}
                className="inline-flex items-center text-primary font-medium hover:text-primary-600 transition-colors"
              >
                View Song Details
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Songs Grid */}
      {displaySongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 card-hover"
            >
              <div className="flex items-start gap-4">
                {song.metadata?.album?.metadata?.album_art?.imgix_url && (
                  <img
                    src={`${song.metadata.album.metadata.album_art.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={song.metadata?.album?.metadata?.title || 'Album Art'}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    width={64}
                    height={64}
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold mb-1 text-gray-900 truncate">
                    {song.metadata?.title || song.title}
                  </h3>
                  
                  {song.metadata?.album?.metadata?.title && (
                    <p className="text-sm text-gray-500 mb-2 truncate">
                      from {song.metadata.album.metadata.title}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    {song.metadata?.length && (
                      <span>{song.metadata.length}</span>
                    )}
                    {song.metadata?.theme?.value && (
                      <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                        {song.metadata.theme.value}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/songs/${song.slug}`}
                    className="inline-flex items-center text-primary font-medium text-sm hover:text-primary-600 transition-colors"
                  >
                    Listen Now
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-600 mb-4">
            Songs Coming Soon
          </h3>
          <p className="text-gray-500">
            We're adding more songs to showcase the best of blink-182.
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center mt-12"
      >
        <Link
          href="/songs"
          className="inline-flex items-center bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View All Songs
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}