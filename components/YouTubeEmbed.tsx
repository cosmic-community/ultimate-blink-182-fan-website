'use client'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export default function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  // Ensure videoId is valid
  if (!videoId || typeof videoId !== 'string') {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">Video not available</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`
  const videoTitle = title || 'YouTube video'

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={videoTitle}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  )
}