'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import YouTubeEmbed from './YouTubeEmbed'
import type { Song } from '@/types'

interface PopularSongsProps {
  songs: Song[]
}

export default function PopularSongs({ songs }: PopularSongsProps) {
  if (!songs || songs.length === 0) {
    return (
      <section className="py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Popular Songs</h2>
          <p className="text-gray-600">Popular songs coming soon.</p>
        </div>
      </section>
    )
  }

  // Show first 3 songs
  const featuredSongs = songs.slice(0, 3)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
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
            The anthems that defined pop-punk and launched a thousand bands
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover"
            >
              {/* Music Video */}
              {song.metadata?.music_video && (
                <div className="aspect-video">
                  <YouTubeEmbed 
                    videoUrl={song.metadata.music_video}
                    title={`${song.metadata?.title || song.title} - blink-182`}
                    showTitle={false}
                    className="w-full h-full rounded-t-2xl"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {song.metadata?.title || song.title}
                  </h3>
                  {song.metadata?.length && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {song.metadata.length}
                    </span>
                  )}
                </div>

                {song.metadata?.album?.metadata?.title && (
                  <p className="text-gray-600 mb-4">
                    From <span className="font-medium">{song.metadata.album.metadata.title}</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {song.metadata?.theme?.value && (
                    <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {song.metadata.theme.value}
                    </span>
                  )}
                  {song.metadata?.writers && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {song.metadata.writers}
                    </span>
                  )}
                </div>

                {song.metadata?.fun_facts && (
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {song.metadata.fun_facts.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                )}

                <div className="flex gap-3">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="flex-1 bg-primary text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    View Details
                  </Link>
                  {song.metadata?.music_video && (
                    <a
                      href={song.metadata.music_video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Watch on YouTube"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
            Explore All Songs
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}