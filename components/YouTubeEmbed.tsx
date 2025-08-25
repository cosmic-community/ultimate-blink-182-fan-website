'use client'

interface YouTubeEmbedProps {
  videoUrl: string
  title: string
  showTitle?: boolean
  className?: string
}

function getVideoId(url: string): string | null {
  if (!url) return null
  
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function YouTubeEmbed({ videoUrl, title, showTitle = true, className = '' }: YouTubeEmbedProps) {
  const videoId = getVideoId(videoUrl)
  
  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div className={`youtube-embed ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
      )}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  )
}