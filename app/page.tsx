import Hero from '@/components/Hero'
import FeaturedAlbums from '@/components/FeaturedAlbums'
import BandMembersPreview from '@/components/BandMembersPreview'
import RecentTimeline from '@/components/RecentTimeline'
import PopularSongs from '@/components/PopularSongs'
import { getAlbums, getBandMembers, getTimelineEvents, getSongs } from '@/lib/cosmic'

export default async function HomePage() {
  const [albums, bandMembers, timelineEvents, songs] = await Promise.all([
    getAlbums(),
    getBandMembers(),
    getTimelineEvents(),
    getSongs()
  ])

  // Get featured albums (latest 3)
  const featuredAlbums = albums.slice(-3).reverse()
  
  // Get recent timeline events (latest 3)
  const recentEvents = timelineEvents.slice(-3).reverse()
  
  // Get popular songs (first 6)
  const popularSongs = songs.slice(0, 6)

  return (
    <div className="space-y-16">
      <Hero />
      
      <section className="container mx-auto px-4">
        <FeaturedAlbums albums={featuredAlbums} />
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BandMembersPreview members={bandMembers} />
        </div>
      </section>

      <section className="container mx-auto px-4">
        <PopularSongs songs={popularSongs} />
      </section>

      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <RecentTimeline events={recentEvents} />
        </div>
      </section>
    </div>
  )
}