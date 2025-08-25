'use client'

import { useState } from 'react'

export interface YouTubeEmbedProps {
  videoUrl: string;
  title: string;
  showTitle?: boolean;
  className?: string;
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function YouTubeEmbed({ 
  videoUrl, 
  title, 
  showTitle = true, 
  className = "" 
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={className}>
      {showTitle && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
}