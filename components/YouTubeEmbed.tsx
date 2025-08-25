'use client'

import { useState } from 'react'

interface YouTubeEmbedProps {
  videoId?: string
  title?: string
  className?: string
}

export default function YouTubeEmbed({ videoId, title = 'YouTube Video', className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Handle undefined videoId by converting to null for consistent type handling
  const safeVideoId: string | null = videoId || null

  if (!safeVideoId) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">Video not available</p>
      </div>
    )
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      
      <iframe
        src={`https://www.youtube.com/embed/${safeVideoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full aspect-video"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}