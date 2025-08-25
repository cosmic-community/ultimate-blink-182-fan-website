'use client'

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ videoUrl, title = "YouTube video", className = "" }: YouTubeEmbedProps) {
  // Extract video ID from YouTube URL with proper null handling
  const getVideoId = (url: string): string | null => {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      
      // Handle different YouTube URL formats
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1) || null;
      }
      
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        const videoId = urlObj.searchParams.get('v');
        return videoId || null;
      }
      
      return null;
    } catch (error) {
      console.error('Invalid YouTube URL:', url);
      return null;
    }
  };

  const videoId = getVideoId(videoUrl);

  // Return null if no valid video ID found
  if (!videoId) {
    console.warn('No valid YouTube video ID found for URL:', videoUrl);
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
}