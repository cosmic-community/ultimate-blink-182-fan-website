'use client'

import { useState } from 'react'

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
}

export default function YouTubeEmbed({ url, title, className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Extract video ID from YouTube URL - handle undefined by converting to null
  const getVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      const videoId = urlObj.searchParams.get('v') // This returns string | null (not undefined)
      
      if (videoId) {
        return videoId
      }

      // Handle different YouTube URL formats
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/')
        if (parts.length > 1) {
          return parts[1].split('?')[0] || null
        }
      }

      if (url.includes('/embed/')) {
        const parts = url.split('/embed/')
        if (parts.length > 1) {
          return parts[1].split('?')[0] || null
        }
      }

      return null
    } catch {
      return null
    }
  }

  const videoId = getVideoId(url)

  if (!videoId) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    )
  }

  return (
    <div className={`relative aspect-video bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-gray-500">Loading video...</div>
        </div>
      )}
      
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}