'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BandMember } from '@/types'

interface BandMembersPreviewProps {
  members: BandMember[]
}

export default function BandMembersPreview({ members }: BandMembersPreviewProps) {
  if (!members || members.length === 0) {
    return (
      <section className="py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">The Band</h2>
          <p className="text-gray-600">Band member information coming soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">The Band</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Meet the iconic members who shaped the sound of pop-punk
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <Link href={`/band/${member.slug}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover text-center">
                {/* Profile Image */}
                <div className="aspect-square overflow-hidden">
                  {member.metadata?.profile_image?.imgix_url ? (
                    <img
                      src={`${member.metadata.profile_image.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                      alt={member.metadata.name || member.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {member.metadata?.name || member.title}
                  </h3>
                  
                  {member.metadata?.role && (
                    <p className="text-primary font-medium mb-3">
                      {member.metadata.role}
                    </p>
                  )}
                  
                  {member.metadata?.years_active && (
                    <p className="text-gray-600 text-sm mb-4">
                      {member.metadata.years_active}
                    </p>
                  )}

                  {member.metadata?.bio && (
                    <div 
                      className="text-gray-600 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: member.metadata.bio.substring(0, 150) + '...' 
                      }} 
                    />
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center mt-12"
      >
        <Link
          href="/band"
          className="inline-flex items-center bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Meet All Members
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}