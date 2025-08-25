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
  showTitle = false,
  className = ''
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : ''
  }

  const videoId = getVideoId(videoUrl)
  
  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div className={`relative ${className}`}>
      {showTitle && title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
      )}
      
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {!isLoaded ? (
          <div 
            className="absolute inset-0 cursor-pointer group"
            onClick={() => setIsLoaded(true)}
          >
            <img
              src={thumbnailUrl}
              alt={title || 'YouTube video thumbnail'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg 
                  className="w-8 h-8 text-white ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title || 'YouTube video player'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  )
}