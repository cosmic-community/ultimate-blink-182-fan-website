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
          <p className="text-gray-600">No albums available at the moment.</p>
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
          Dive into the discography that defined a generation of pop-punk fans
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <Link href={`/albums/${album.slug}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover punk-border">
                {/* Album Art */}
                <div className="aspect-square overflow-hidden">
                  {album.metadata?.album_art?.imgix_url ? (
                    <img
                      src={`${album.metadata.album_art.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                      alt={album.metadata.title || album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

                {/* Album Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {album.metadata?.title || album.title}
                  </h3>
                  
                  {album.metadata?.release_date && (
                    <p className="text-gray-600 mb-3">
                      {new Date(album.metadata.release_date).getFullYear()}
                    </p>
                  )}
                  
                  {album.metadata?.record_label && (
                    <p className="text-sm text-gray-500 mb-4">
                      {album.metadata.record_label}
                    </p>
                  )}

                  {album.metadata?.era?.value && (
                    <span className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {album.metadata.era.value}
                    </span>
                  )}
                </div>
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