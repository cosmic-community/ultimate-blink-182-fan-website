'use client'

interface YouTubeEmbedProps {
  videoId: string | undefined;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ videoId, title = "YouTube Video", className = "" }: YouTubeEmbedProps) {
  // Handle undefined videoId by providing null as fallback
  const embedVideoId: string | null = videoId || null;
  
  if (!embedVideoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Video not available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${embedVideoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
}