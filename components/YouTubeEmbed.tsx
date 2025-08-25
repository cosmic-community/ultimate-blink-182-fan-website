'use client'

import { useState, useEffect } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  width?: number
  height?: number
}

export default function YouTubeEmbed({ 
  videoId, 
  title = 'YouTube Video', 
  width = 560, 
  height = 315 
}: YouTubeEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)

  useEffect(() => {
    // Extract video ID from URL if full URL is provided
    const extractVideoId = (url: string): string | null => {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      return match ? match[1] : url // Return original if it's already just an ID, null if no match
    }

    const id = extractVideoId(videoId)
    // Fix: Convert undefined to null explicitly
    setEmbedUrl(id || null)
  }, [videoId])

  if (!embedUrl) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-200 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-gray-500">Loading video...</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${embedUrl}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}