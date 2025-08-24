'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
          <p className="text-gray-600">Song information coming soon.</p>
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
          <span className="text-gradient">Popular Songs</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          The hits that defined a generation and continue to inspire fans worldwide
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/songs/${song.slug}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 card-hover border-l-4 border-primary">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors duration-300">
                      {song.metadata?.title || song.title}
                    </h3>
                    
                    {song.metadata?.album?.title && (
                      <p className="text-gray-600 text-sm">
                        from <em>{song.metadata.album.title}</em>
                      </p>
                    )}
                  </div>
                  
                  {song.metadata?.length && (
                    <span className="text-primary font-medium text-sm bg-primary bg-opacity-10 px-2 py-1 rounded">
                      {song.metadata.length}
                    </span>
                  )}
                </div>

                {song.metadata?.writers && (
                  <p className="text-gray-500 text-sm mb-3">
                    Written by {song.metadata.writers}
                  </p>
                )}

                {song.metadata?.theme?.value && (
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {song.metadata.theme.value}
                  </span>
                )}

                {song.metadata?.music_video && (
                  <div className="mt-4">
                    <span className="inline-flex items-center text-primary text-sm font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Music Video Available
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
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