'use client'

import { useState, useEffect } from 'react'
import { getSpotifyTrack, type SpotifyTrack } from '@/lib/spotify'

interface SpotifyPlayerProps {
  trackName?: string;
  artistName?: string;
}

export default function SpotifyPlayer({ trackName = "All the Small Things", artistName = "blink-182" }: SpotifyPlayerProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrack() {
      try {
        setLoading(true)
        setError(null)
        
        const spotifyTrack = await getSpotifyTrack(trackName, artistName)
        
        // Fix: Handle undefined case properly
        if (spotifyTrack) {
          setTrack(spotifyTrack)
        } else {
          setTrack(null)
          setError('Track not found on Spotify')
        }
      } catch (err) {
        setError('Failed to load Spotify track')
        setTrack(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTrack()
  }, [trackName, artistName])

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Spotify player...</p>
      </div>
    )
  }

  if (error || !track) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p className="text-gray-600 mb-2">{error || 'Track not available'}</p>
        <p className="text-sm text-gray-500">
          Searching for: {trackName} by {artistName}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Album Art */}
      <div className="aspect-square relative bg-gray-200">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt={`${track.name} album art`}
            className="w-full h-full object-cover"
            width={400}
            height={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{track.name}</h3>
        <p className="text-gray-600 mb-4">{track.artist}</p>
        
        {track.album && (
          <p className="text-sm text-gray-500 mb-4">
            Album: {track.album}
          </p>
        )}

        {/* Spotify Link */}
        {track.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#1DB954] text-white font-medium py-2 px-4 rounded-full hover:bg-[#1ed760] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.589 14.567c-.359 0-.595-.113-.889-.347-1.787-1.117-4.04-1.728-6.286-1.728-1.213 0-2.496.177-3.638.478-.36.095-.53.159-.889.159-.595 0-1.071-.478-1.071-1.073 0-.537.358-.952.832-1.071 1.371-.364 2.829-.595 4.766-.595 2.565 0 5.017.708 6.926 2.022.416.284.595.595.595 1.071 0 .595-.476 1.084-1.071 1.084z"/>
            </svg>
            Play on Spotify
          </a>
        )}

        {track.previewUrl && (
          <audio
            controls
            className="w-full mt-4"
            preload="none"
          >
            <source src={track.previewUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  )
}