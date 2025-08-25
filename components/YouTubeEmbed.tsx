'use client'

interface YouTubeEmbedProps {
  url: string | undefined | null;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ url, title = '', className = '' }: YouTubeEmbedProps) {
  // Handle undefined/null URL cases
  if (!url) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">Video not available</p>
      </div>
    )
  }

  // Extract video ID from YouTube URL with proper null checking
  const getVideoId = (videoUrl: string): string | null => {
    try {
      const urlObj = new URL(videoUrl)
      
      // Handle youtube.com/watch?v= format
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        return urlObj.searchParams.get('v')
      }
      
      // Handle youtu.be/ format
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1)
      }
      
      return null
    } catch (error) {
      console.error('Invalid YouTube URL:', error)
      return null
    }
  }

  const videoId = getVideoId(url)

  if (!videoId) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">Invalid video URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div className={`relative w-full h-0 pb-[56.25%] ${className}`}>
      <iframe
        src={embedUrl}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg"
      />
    </div>
  )
}