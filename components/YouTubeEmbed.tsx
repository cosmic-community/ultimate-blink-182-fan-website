'use client'

interface YouTubeEmbedProps {
  videoUrl: string
  title?: string
  showTitle?: boolean
  className?: string
}

export default function YouTubeEmbed({ videoUrl, title, showTitle = true, className = '' }: YouTubeEmbedProps) {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const videoId = getVideoId(videoUrl)
  
  if (!videoId) {
    return (
      <div className="bg-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    )
  }

  return (
    <div className={`youtube-embed ${className}`}>
      {showTitle && title && (
        <h3 className="text-lg font-bold mb-4 text-gray-900">{title}</h3>
      )}
      <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'YouTube video'}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}