'use client'

import { useState, useEffect } from 'react'
import { youtubeAPI, type YouTubeVideo } from '@/lib/youtube'

interface YouTubeVideoGridProps {
  searchQuery?: string;
  maxResults?: number;
}

export default function YouTubeVideoGrid({ 
  searchQuery = 'blink-182', 
  maxResults = 12 
}: YouTubeVideoGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await youtubeAPI.searchVideos(searchQuery);
        setVideos(results);
      } catch (err) {
        setError('Failed to load videos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(maxResults)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">
          <p>Unable to load YouTube videos</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.slice(0, maxResults).map((video) => (
        <div
          key={video.id.videoId}
          className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
        >
          <a
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="aspect-video relative">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-full object-cover"
                width={320}
                height={180}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {video.snippet.channelTitle}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(video.snippet.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}