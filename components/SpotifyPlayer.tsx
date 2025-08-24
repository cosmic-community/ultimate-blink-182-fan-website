'use client'

import { useState, useEffect } from 'react'
import { spotifyAPI, type SpotifyTrack, formatDuration, getArtistNames } from '@/lib/spotify'

interface SpotifyPlayerProps {
  searchQuery?: string;
  className?: string;
}

export default function SpotifyPlayer({ searchQuery = 'blink-182', className = '' }: SpotifyPlayerProps) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const spotifyTracks = await spotifyAPI.searchTracks(searchQuery, 10)
        setTracks(spotifyTracks)
        if (spotifyTracks.length > 0) {
          setCurrentTrack(spotifyTracks[0])
        }
      } catch (err) {
        console.error('Failed to fetch Spotify tracks:', err)
        setError('Failed to load tracks from Spotify')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTracks()
  }, [searchQuery])

  const handleTrackSelect = (track: SpotifyTrack) => {
    setCurrentTrack(track)
    setIsPlaying(false)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-600">
          <p className="text-red-500 mb-2">⚠️ {error}</p>
          <p className="text-sm">Spotify integration requires valid API credentials.</p>
        </div>
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-600">
          <p>No tracks found for "{searchQuery}"</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <h3 className="text-lg font-bold flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.481.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Listen on Spotify
        </h3>
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <img
              src={currentTrack.album.images[0]?.url || '/placeholder-album.png'}
              alt={currentTrack.album.name}
              className="w-16 h-16 rounded-lg shadow-md"
              width={64}
              height={64}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate">{currentTrack.name}</h4>
              <p className="text-sm text-gray-600 truncate">
                {getArtistNames(currentTrack.artists)}
              </p>
              <p className="text-xs text-gray-500">{currentTrack.album.name}</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={togglePlayback}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                disabled={!currentTrack.preview_url}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <span className="text-xs text-gray-500">
                {formatDuration(currentTrack.duration_ms)}
              </span>
            </div>
          </div>
          
          {!currentTrack.preview_url && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              Preview not available - Click to open in Spotify
            </p>
          )}
        </div>
      )}

      {/* Track List */}
      <div className="max-h-64 overflow-y-auto">
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => handleTrackSelect(track)}
            className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
              currentTrack?.id === track.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
            }`}
          >
            <img
              src={track.album.images[2]?.url || track.album.images[0]?.url || '/placeholder-album.png'}
              alt={track.album.name}
              className="w-10 h-10 rounded"
              width={40}
              height={40}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{track.name}</p>
              <p className="text-xs text-gray-600 truncate">
                {getArtistNames(track.artists)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatDuration(track.duration_ms)}
              </span>
              {track.preview_url && (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <a
          href={currentTrack?.external_urls.spotify || `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center justify-center"
        >
          Open in Spotify App
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
            <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}