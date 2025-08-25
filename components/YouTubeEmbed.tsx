'use client'

import { useState } from 'react'

export interface YouTubeEmbedProps {
  videoUrl: string
  title: string
  showTitle?: boolean
  className?: string
}

function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return ''
}

export default function YouTubeEmbed({ 
  videoUrl, 
  title, 
  showTitle = true,
  className = '' 
}: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const videoId = extractVideoId(videoUrl)

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Unable to load video</p>
        <a 
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline mt-2 inline-block"
        >
          Watch on YouTube
        </a>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
      )}
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  )
}