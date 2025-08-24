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
          Meet the legendary musicians behind the pop-punk revolution
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group"
          >
            {/* Profile Image */}
            {member.metadata?.profile_image?.imgix_url && (
              <div className="aspect-square overflow-hidden">
                <img
                  src={`${member.metadata.profile_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                  alt={member.metadata.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width={400}
                  height={400}
                />
              </div>
            )}

            <div className="p-6">
              {/* Role Badge */}
              {member.metadata?.role && (
                <span className="inline-block bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {member.metadata.role}
                </span>
              )}

              {/* Name */}
              <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                {member.metadata?.name || member.title}
              </h3>

              {/* Years Active */}
              {member.metadata?.years_active && (
                <div className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">Active: </span>
                  {member.metadata.years_active}
                </div>
              )}

              {/* Bio Preview */}
              {member.metadata?.bio && (
                <div 
                  className="text-gray-700 text-sm line-clamp-3 mb-4"
                  dangerouslySetInnerHTML={{ 
                    __html: member.metadata.bio.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                  }}
                />
              )}

              {/* Fun Facts Preview */}
              {member.metadata?.fun_facts && (
                <div className="bg-gradient-to-r from-primary bg-opacity-5 to-pink-50 p-3 rounded-lg">
                  <div className="text-xs text-primary font-medium mb-1">Fun Fact:</div>
                  <div className="text-sm text-gray-700">
                    {member.metadata.fun_facts.split('\n')[0]?.replace('• ', '') || ''}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <Link
          href="/band"
          className="inline-flex items-center bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Meet the Band
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}