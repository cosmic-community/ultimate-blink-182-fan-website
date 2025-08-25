'use client'

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ url, title, className = "" }: YouTubeEmbedProps) {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    // Add proper null check for match result
    if (!match || !match[1]) {
      return null;
    }
    
    return match[1];
  };

  const videoId = getVideoId(url);

  // Return null if we can't extract a valid video ID
  if (!videoId) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
        <p className="text-gray-600 text-center">Invalid YouTube URL</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}