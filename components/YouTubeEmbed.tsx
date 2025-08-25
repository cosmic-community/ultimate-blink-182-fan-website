'use client'

import { useState } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export default function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Validate videoId to ensure it's not undefined
  if (!videoId) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">Video not available</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`
  const videoTitle = title ?? 'YouTube Video'

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title={videoTitle}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        className="aspect-video w-full"
      />
    </div>
  )
}