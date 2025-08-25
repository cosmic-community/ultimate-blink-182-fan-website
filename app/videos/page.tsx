import { Metadata } from 'next'
import YouTubeEmbed from '@/components/YouTubeEmbed'

export const metadata: Metadata = {
  title: 'Videos - blink-182',
  description: 'Watch iconic music videos from blink-182 including All the Small Things, What\'s My Age Again?, and more classic pop-punk anthems.',
}

const featuredVideos = [
  {
    id: 'all-the-small-things',
    title: 'All the Small Things',
    url: 'https://www.youtube.com/watch?v=9Ht5RZpzPqw',
    description: 'The iconic music video that parodies boy bands and became a cultural phenomenon.'
  },
  {
    id: 'whats-my-age-again',
    title: "What's My Age Again?",
    url: 'https://www.youtube.com/watch?v=K7l5ZeVVoCA',
    description: 'The legendary naked run through the streets of Los Angeles.'
  },
  {
    id: 'adams-song',
    title: "Adam's Song",
    url: 'https://www.youtube.com/watch?v=2MRdtXWcgIw',
    description: 'A more serious and introspective side of blink-182.'
  },
  {
    id: 'first-date',
    title: 'First Date',
    url: 'https://www.youtube.com/watch?v=vVy9Lgpg1m8',
    description: 'High energy pop-punk with the band\'s signature humor.'
  }
]

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Music Videos
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            Watch the iconic music videos that defined a generation of pop-punk
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                <YouTubeEmbed 
                  videoUrl={video.url}
                  title={video.title}
                  className="p-6 pb-4"
                />
                <div className="px-6 pb-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{video.title}</h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}