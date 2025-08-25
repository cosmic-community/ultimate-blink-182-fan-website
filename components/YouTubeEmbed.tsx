'use client'

import { useState } from 'react'

export interface YouTubeEmbedProps {
  videoUrl: string
  title: string
  showTitle?: boolean
  className?: string
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null
  
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function YouTubeEmbed({ 
  videoUrl, 
  title, 
  showTitle = false, 
  className = '' 
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  const videoId = getYouTubeVideoId(videoUrl)
  
  if (!videoId) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
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
      
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title || 'YouTube Video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  )
}