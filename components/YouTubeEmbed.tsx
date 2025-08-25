'use client'

import { useState } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  autoplay?: boolean
  className?: string
}

export default function YouTubeEmbed({ 
  videoId, 
  title = 'YouTube Video',
  autoplay = false,
  className = ''
}: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Fix the TypeScript error by properly handling undefined values
  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`
  
  // Convert undefined to null for proper type compatibility
  const videoTitle: string | null = title || null

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative w-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading video...</div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        title={videoTitle || 'YouTube Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video rounded-lg shadow-lg"
        onLoad={handleLoad}
      />
    </div>
  )
}