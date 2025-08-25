'use client'

interface YouTubeEmbedProps {
  videoUrl: string
  title?: string
  showTitle?: boolean
  className?: string
}

export default function YouTubeEmbed({ 
  videoUrl, 
  title = 'YouTube Video',
  showTitle = false,
  className = ''
}: YouTubeEmbedProps) {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const videoId = getVideoId(videoUrl)

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600">Invalid YouTube URL</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {showTitle && title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
      )}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  )
}