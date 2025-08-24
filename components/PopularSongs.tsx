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
          <p className="text-gray-600">Songs coming soon.</p>
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
          The hits that defined a generation and shaped pop-punk forever
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
          >
            {/* Album Art */}
            {song.metadata?.album?.metadata?.album_art?.imgix_url && (
              <div className="aspect-square overflow-hidden">
                <img
                  src={`${song.metadata.album.metadata.album_art.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                  alt={song.metadata.album.metadata.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width={300}
                  height={300}
                />
              </div>
            )}

            <div className="p-6">
              {/* Theme Badge */}
              {song.metadata?.theme?.value && (
                <span className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                  {song.metadata.theme.value}
                </span>
              )}

              {/* Song Title */}
              <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                {song.metadata?.title || song.title}
              </h3>

              {/* Album Info */}
              {song.metadata?.album?.metadata?.title && (
                <div className="text-gray-600 text-sm mb-2">
                  from <span className="font-medium">{song.metadata.album.metadata.title}</span>
                  {song.metadata.album.metadata.release_date && (
                    <span className="ml-2 text-gray-500">
                      ({new Date(song.metadata.album.metadata.release_date).getFullYear()})
                    </span>
                  )}
                </div>
              )}

              {/* Song Length */}
              {song.metadata?.length && (
                <div className="text-gray-500 text-sm mb-4">
                  Duration: {song.metadata.length}
                </div>
              )}

              {/* Lyrics Preview */}
              {song.metadata?.lyrics && (
                <div className="mb-4">
                  <div className="text-gray-700 text-sm italic line-clamp-2">
                    "{song.metadata.lyrics.split('\n')[0]}"
                  </div>
                </div>
              )}

              {/* Music Video Link */}
              {song.metadata?.music_video && (
                <a
                  href={song.metadata.music_video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Video
                </a>
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