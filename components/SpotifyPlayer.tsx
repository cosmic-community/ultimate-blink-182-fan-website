'use client'

import { useState, useEffect } from 'react'
import { spotifyAPI, formatTrackForDisplay, type SpotifyTrack, type SpotifyPlayerProps } from '@/lib/spotify'
import { motion, AnimatePresence } from 'framer-motion'

export default function SpotifyPlayer({ searchQuery = 'blink-182', className = '' }: SpotifyPlayerProps) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPreview, setCurrentPreview] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  useEffect(() => {
    loadTracks(searchQuery)
  }, [searchQuery])

  const loadTracks = async (query: string) => {
    setLoading(true)
    try {
      const results = await spotifyAPI.searchTracks(query)
      setTracks(results)
    } catch (error) {
      console.error('Failed to load tracks:', error)
      setTracks([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      loadTracks(searchTerm.trim())
    }
  }

  const playPreview = (previewUrl: string | null) => {
    if (currentPreview === previewUrl) {
      setCurrentPreview(null)
    } else {
      setCurrentPreview(previewUrl)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.39-.857.216-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.472-.746 3.808-.871 7.076-.496 9.712 1.115.293.18.39.563.21.857-.09.15-.234.234-.38.234-.113 0-.227-.035-.32-.086-.001-.001-.002-.001-.002-.001zm1.414-3.317c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.517-.125-.413.106-.849.517-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.481.707.256 1.072l.003-.001zm.126-3.453c-3.223-1.914-8.54-2.09-11.618-1.156-.491.149-1.012-.128-1.16-.619-.149-.491.128-1.012.619-1.16 3.532-1.073 9.404-.865 13.115 1.338.445.264.591.842.327 1.287-.264.445-.842.591-1.287.327-.002-.001-.004-.002-.006-.003z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Spotify Player</h2>
            <p className="text-green-100">Discover and stream tracks</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for tracks..."
            className="w-full px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600">Loading tracks...</p>
          </div>
        ) : tracks.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {tracks.map((track) => {
                const formattedTrack = formatTrackForDisplay(track)
                
                return (
                  <motion.div
                    key={formattedTrack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* Album Art */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {formattedTrack.image ? (
                        <img
                          src={formattedTrack.image}
                          alt={`${formattedTrack.album} cover`}
                          className="w-full h-full object-cover"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21s4.5-2.01 4.5-4.5V7h4V3h-7z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {formattedTrack.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {formattedTrack.artist} • {formattedTrack.album}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formattedTrack.duration}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Preview Button */}
                      {formattedTrack.previewUrl && (
                        <button
                          onClick={() => playPreview(formattedTrack.previewUrl)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            currentPreview === formattedTrack.previewUrl
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                        >
                          {currentPreview === formattedTrack.previewUrl ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Spotify Link */}
                      {formattedTrack.spotifyUrl && (
                        <a
                          href={formattedTrack.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                          title="Open in Spotify"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.39-.857.216-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.472-.746 3.808-.871 7.076-.496 9.712 1.115.293.18.39.563.21.857-.09.15-.234.234-.38.234-.113 0-.227-.035-.32-.086-.001-.001-.002-.001-.002-.001zm1.414-3.317c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.517-.125-.413.106-.849.517-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.481.707.256 1.072l.003-.001zm.126-3.453c-3.223-1.914-8.54-2.09-11.618-1.156-.491.149-1.012-.128-1.16-.619-.149-.491.128-1.012.619-1.16 3.532-1.073 9.404-.865 13.115 1.338.445.264.591.842.327 1.287-.264.445-.842.591-1.287.327-.002-.001-.004-.002-.006-.003z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-lg font-bold text-gray-600 mb-2">No tracks found</h3>
            <p className="text-gray-500">Try searching for a different term.</p>
          </div>
        )}
      </div>

      {/* Audio Preview */}
      {currentPreview && (
        <div className="bg-gray-50 p-4 border-t">
          <audio
            src={currentPreview}
            controls
            autoPlay
            className="w-full"
            onEnded={() => setCurrentPreview(null)}
          />
        </div>
      )}
    </div>
  )
}