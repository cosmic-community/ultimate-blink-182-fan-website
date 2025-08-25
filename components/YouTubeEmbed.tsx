interface YouTubeEmbedProps {
  videoId?: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ 
  videoId, 
  title = "YouTube video", 
  className = "" 
}: YouTubeEmbedProps) {
  // Handle undefined videoId by providing null fallback for proper typing
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  if (!embedUrl) {
    return (
      <div className={`aspect-video bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Video not available</p>
      </div>
    );
  }

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}