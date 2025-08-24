'use client'

import { useState } from 'react'
import type { YouTubeVideo } from '@/lib/youtube'
import { youtubeAPI } from '@/lib/youtube'

interface YouTubeVideoGridProps {
  videos: YouTubeVideo[]
  title: string
  className?: string
}

export default function YouTubeVideoGrid({ videos, title, className = '' }: YouTubeVideoGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)

  const formatViews = (views: string): string => {
    const num = parseInt(views)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`
    }
    return `${num} views`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const closeModal = () => {
    setSelectedVideo(null)
  }

  if (!videos || videos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">No videos available</p>
      </div>
    )
  }

  return (
    <>
      <div className={className}>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">{title}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer card-hover"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative">
                <img
                  src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                  width={480}
                  height={360}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {video.snippet.title}
                </h4>
                
                <p className="text-gray-600 text-xs mb-2">
                  {video.snippet.channelTitle}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(video.snippet.publishedAt)}</span>
                  {video.statistics?.viewCount && (
                    <span>{formatViews(video.statistics.viewCount)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                  title={selectedVideo.snippet.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {selectedVideo.snippet.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <span>{selectedVideo.snippet.channelTitle}</span>
                  <span>{formatDate(selectedVideo.snippet.publishedAt)}</span>
                </div>
                
                {selectedVideo.snippet.description && (
                  <div className="text-gray-700 text-sm whitespace-pre-wrap">
                    {selectedVideo.snippet.description.length > 300 
                      ? `${selectedVideo.snippet.description.substring(0, 300)}...`
                      : selectedVideo.snippet.description
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}