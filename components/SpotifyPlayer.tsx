'use client'

import { useState, useEffect } from 'react'
import type { SpotifyTrack } from '@/lib/spotify'

interface SpotifyPlayerProps {
  tracks: SpotifyTrack[]
  className?: string
}

export default function SpotifyPlayer({ tracks, className = '' }: SpotifyPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audio) {
      audio.addEventListener('ended', handleTrackEnd)
      audio.addEventListener('play', () => setIsPlaying(true))
      audio.addEventListener('pause', () => setIsPlaying(false))
      
      return () => {
        audio.removeEventListener('ended', handleTrackEnd)
        audio.removeEventListener('play', () => setIsPlaying(true))
        audio.removeEventListener('pause', () => setIsPlaying(false))
      }
    }
  }, [audio])

  const handleTrackEnd = () => {
    setIsPlaying(false)
    setCurrentTrack(null)
  }

  const playTrack = (track: SpotifyTrack) => {
    if (!track.preview_url) return

    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    const newAudio = new Audio(track.preview_url)
    setAudio(newAudio)
    setCurrentTrack(track)
    newAudio.play()
  }

  const pauseTrack = () => {
    if (audio) {
      audio.pause()
    }
  }

  const resumeTrack = () => {
    if (audio) {
      audio.play()
    }
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">No Spotify tracks available</p>
      </div>
    )
  }

  return (
    <div className={`spotify-player ${className}`}>
      {/* Current Track Display */}
      {currentTrack && (
        <div className="bg-black text-white p-4 rounded-lg mb-4 flex items-center gap-4">
          <img
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.album.name}
            className="w-16 h-16 rounded-lg"
            width={64}
            height={64}
          />
          <div className="flex-1">
            <h4 className="font-bold">{currentTrack.name}</h4>
            <p className="text-gray-300">{currentTrack.artists[0]?.name}</p>
            <p className="text-sm text-gray-400">{currentTrack.album.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <button
                onClick={pauseTrack}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={resumeTrack}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
              currentTrack?.id === track.id ? 'bg-green-50 border border-green-200' : ''
            }`}
          >
            <div className="flex-shrink-0 text-gray-500 w-6 text-center">
              {index + 1}
            </div>
            
            <img
              src={track.album.images[2]?.url || track.album.images[0]?.url}
              alt={track.album.name}
              className="w-12 h-12 rounded object-cover"
              width={48}
              height={48}
            />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{track.name}</h4>
              <p className="text-sm text-gray-600 truncate">{track.album.name}</p>
            </div>
            
            <div className="flex-shrink-0 text-sm text-gray-500">
              {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </div>
            
            {track.preview_url ? (
              <button
                onClick={() => currentTrack?.id === track.id && isPlaying ? pauseTrack() : playTrack(track)}
                className="flex-shrink-0 bg-primary hover:bg-primary-600 text-white p-2 rounded-full transition-colors"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            ) : (
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                title="Listen on Spotify"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.599 0-.36.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}