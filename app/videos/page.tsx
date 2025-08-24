import { Metadata } from 'next'
import { youtubeAPI } from '@/lib/youtube'
import YouTubeVideoGrid from '@/components/YouTubeVideoGrid'

export const metadata: Metadata = {
  title: 'Videos - blink-182 Music Videos & Live Performances',
  description: 'Watch blink-182 music videos, live performances, interviews, and behind-the-scenes content.',
}

export default async function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Videos & Performances
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Music videos, live performances, interviews, and behind-the-scenes content
          </p>
        </div>
      </section>

      {/* Music Videos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Music Videos</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Iconic music videos from throughout blink-182's career
            </p>
          </div>
          
          <YouTubeVideoGrid searchQuery="blink-182 music video" maxResults={12} />
        </div>
      </section>

      {/* Live Performances */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Live Performances</h2>
            <p className="text-gray-600 text-lg">
              Watch blink-182 perform live from concerts and festivals
            </p>
          </div>
          
          <YouTubeVideoGrid searchQuery="blink-182 live performance" maxResults={8} />
        </div>
      </section>

      {/* Interviews & Behind the Scenes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Interviews & More</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Behind-the-scenes content and interviews with the band
            </p>
          </div>
          
          <YouTubeVideoGrid searchQuery="blink-182 interview behind the scenes" maxResults={8} />
        </div>
      </section>
    </div>
  )
}