'use client'

import { useState } from 'react'

export interface YouTubeEmbedProps {
  videoUrl: string
  title?: string
  showTitle?: boolean
  className?: string
}

export default function YouTubeEmbed({ 
  videoUrl, 
  title, 
  showTitle = true, 
  className = '' 
}: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const videoId = getVideoId(videoUrl)

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`

  return (
    <div className={`relative ${className}`}>
      {showTitle && title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
      )}
      
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 text-white">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Loading video...</span>
            </div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title || 'YouTube video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}