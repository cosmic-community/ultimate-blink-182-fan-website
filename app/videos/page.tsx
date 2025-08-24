import { Metadata } from 'next'
import { Suspense } from 'react'
import { youtubeAPI } from '@/lib/youtube'
import YouTubeVideoGrid from '@/components/YouTubeVideoGrid'

export const metadata: Metadata = {
  title: 'Videos - blink-182 Music Videos & Performances',
  description: 'Watch blink-182 music videos, live performances, and exclusive content on YouTube.',
}

async function VideosContent() {
  const youtubeData = await youtubeAPI.getBlink182Videos()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Videos
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Music videos, live performances, and exclusive blink-182 content
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Music Videos */}
        {youtubeData.musicVideos.length > 0 && (
          <YouTubeVideoGrid 
            videos={youtubeData.musicVideos} 
            title="🎵 Official Music Videos"
          />
        )}

        {/* Live Performances */}
        {youtubeData.livePerformances.length > 0 && (
          <YouTubeVideoGrid 
            videos={youtubeData.livePerformances} 
            title="🎤 Live Performances"
          />
        )}

        {/* Interviews */}
        {youtubeData.interviews.length > 0 && (
          <YouTubeVideoGrid 
            videos={youtubeData.interviews} 
            title="💬 Interviews & Behind the Scenes"
          />
        )}

        {/* Recent Videos */}
        {youtubeData.recentVideos.length > 0 && (
          <YouTubeVideoGrid 
            videos={youtubeData.recentVideos} 
            title="📺 Latest Videos"
          />
        )}

        {/* No content fallback */}
        {!youtubeData.musicVideos.length && 
         !youtubeData.livePerformances.length && 
         !youtubeData.interviews.length && 
         !youtubeData.recentVideos.length && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              No Videos Available
            </h2>
            <p className="text-gray-500">
              YouTube content will be displayed here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VideosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    }>
      <VideosContent />
    </Suspense>
  )
}