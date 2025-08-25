'use client'

interface YouTubeEmbedProps {
  videoUrl: string;
  title: string;
  showTitle?: boolean;
  className?: string;
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function YouTubeEmbed({ videoUrl, title, showTitle = true, className = '' }: YouTubeEmbedProps) {
  const videoId = extractVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}

export type { YouTubeEmbedProps };