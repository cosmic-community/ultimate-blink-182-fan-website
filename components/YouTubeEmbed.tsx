'use client'

import { useState } from 'react'

export interface YouTubeEmbedProps {
  videoUrl: string
  title: string
  showTitle?: boolean
  className?: string
}

export default function YouTubeEmbed({ 
  videoUrl, 
  title, 
  showTitle = true, 
  className = "" 
}: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  const videoId = getVideoId(videoUrl)

  if (!videoId) {
    return (
      <div className={`bg-gray-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`

  return (
    <div className={`relative ${className}`}>
      {showTitle && (
        <h3 className="font-bold text-lg mb-4 text-gray-900">{title}</h3>
      )}
      
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title}
          width="100%"
          height="100%"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}