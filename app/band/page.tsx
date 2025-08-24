import { Metadata } from 'next'
import { getBandMembers } from '@/lib/cosmic'

export const metadata: Metadata = {
  title: 'Band Members - Meet blink-182',
  description: 'Get to know the talented musicians behind blink-182: Tom DeLonge, Mark Hoppus, and Travis Barker. Learn about their history, roles, and contributions.',
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
            Meet the legendary musicians who shaped the sound of pop-punk
          </p>
        </div>
      </section>

      {/* Band Members */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {members.length > 0 ? (
            <div className="max-w-6xl mx-auto space-y-16">
              {members.map((member, index) => (
                <div 
                  key={member.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden card-hover ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Profile Image */}
                    {member.metadata?.profile_image?.imgix_url && (
                      <div className="lg:w-1/2 flex-shrink-0">
                        <img
                          src={`${member.metadata.profile_image.imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`}
                          alt={member.metadata.name}
                          className="w-full h-64 lg:h-96 object-cover"
                          width={600}
                          height={400}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                      {/* Role Badge */}
                      {member.metadata?.role && (
                        <span className="inline-block bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4 w-fit">
                          {member.metadata.role}
                        </span>
                      )}

                      {/* Name */}
                      <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                        {member.metadata?.name || member.title}
                      </h2>

                      {/* Years Active */}
                      {member.metadata?.years_active && (
                        <div className="text-gray-600 mb-6">
                          <span className="font-medium">Years Active: </span>
                          {member.metadata.years_active}
                        </div>
                      )}

                      {/* Bio */}
                      {member.metadata?.bio && (
                        <div 
                          className="text-gray-700 mb-8 prose prose-lg"
                          dangerouslySetInnerHTML={{ __html: member.metadata.bio }}
                        />
                      )}

                      {/* Fun Facts */}
                      {member.metadata?.fun_facts && (
                        <div className="bg-gradient-to-r from-primary bg-opacity-5 to-pink-50 p-6 rounded-lg border-l-4 border-primary">
                          <h3 className="font-bold text-lg mb-4 text-primary">Fun Facts</h3>
                          <div className="text-gray-700 whitespace-pre-line space-y-1">
                            {member.metadata.fun_facts.split('\n').map((fact, factIndex) => (
                              <div key={factIndex} className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>{fact.replace('• ', '')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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