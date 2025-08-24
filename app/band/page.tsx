import { Metadata } from 'next'
import Link from 'next/link'
import { getBandMembers } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Band Members - blink-182',
  description: 'Meet the legendary members of blink-182: Tom DeLonge, Mark Hoppus, Travis Barker, and the others who shaped pop-punk history.',
}

export default async function BandPage() {
  const members = await getBandMembers()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            The Band
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white text-opacity-90">
            The legendary musicians who created the soundtrack to a generation
          </p>
        </div>
      </section>

      {/* Band Members */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => (
                <Link key={member.id} href={`/band/${member.slug}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover text-center">
                    <div className="aspect-square overflow-hidden">
                      {member.metadata?.profile_image?.imgix_url ? (
                        <img
                          src={`${member.metadata.profile_image.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                          alt={member.metadata.name || member.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center">
                          <span className="text-white text-6xl font-bold">
                            {(member.metadata?.name || member.title).charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 hover:text-primary transition-colors duration-300">
                        {member.metadata?.name || member.title}
                      </h3>
                      
                      {member.metadata?.role && (
                        <p className="text-primary font-medium text-lg mb-3">
                          {member.metadata.role}
                        </p>
                      )}
                      
                      {member.metadata?.years_active && (
                        <p className="text-gray-600 text-sm mb-4">
                          Active: {member.metadata.years_active}
                        </p>
                      )}

                      {member.metadata?.bio && (
                        <div 
                          className="text-gray-600 text-sm line-clamp-4 mb-4"
                          dangerouslySetInnerHTML={{ 
                            __html: member.metadata.bio.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
                          }} 
                        />
                      )}

                      {member.metadata?.fun_facts && (
                        <div className="bg-primary bg-opacity-5 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 font-medium">
                            {member.metadata.fun_facts.split('\n')[0]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Band Members Available
              </h2>
              <p className="text-gray-500">
                Band member information will be displayed here once available.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}