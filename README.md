# Ultimate blink-182 Fan Website

![blink-182 Fan Website](https://imgix.cosmicjs.com/ea0fc640-8104-11f0-8dcc-651091f6a7c0-photo-1493225457124-a3eb161ffa5f-1756051855378.jpg?w=1200&h=300&fit=crop&auto=format,compress)

The ultimate destination for blink-182 fans! This comprehensive fan website celebrates over 30 years of pop-punk history with an immersive experience through the band's complete discography, interactive timeline, member profiles, and tour archive.

## Features

- 🎵 **Complete Discography** - Explore albums with artwork, track listings, and stories
- 📅 **Interactive Timeline** - Visual journey through band history and major milestones  
- 🎸 **Band Member Profiles** - Comprehensive bios, fun facts, and career highlights
- 🎤 **Tour Archive** - Concert history with venue details and memorable moments
- 🎬 **Music & Videos** - Integrated music videos and audio content
- 🔍 **Song Database** - Searchable lyrics and song information
- 📱 **Mobile Optimized** - Responsive design for fans on the go
- 🎨 **Pop-Punk Aesthetic** - Vibrant design capturing blink's energy

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=68ab38b7d9e4dc4e1d0a40eb&clone_repository=68ab3b57d9e4dc4e1d0a410f)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> I want to create the ultimate fan page for the band blink 182

### Code Generation Prompt

> I want to build the ultimate fan website for the band Blink-182. Feel free to add anything in that is publicly available on the band, including music and video.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Modern utility-first styling
- **Cosmic CMS** - Headless CMS for content management
- **Framer Motion** - Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the blink-182 bucket

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Set up environment variables in `.env.local`:
```bash
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Albums
```typescript
import { cosmic } from '@/lib/cosmic'

export async function getAlbums() {
  const { objects: albums } = await cosmic.objects
    .find({ type: 'albums' })
    .props('id,title,slug,metadata')
    .depth(1)
  
  return albums.sort((a, b) => {
    const dateA = new Date(a.metadata.release_date).getTime()
    const dateB = new Date(b.metadata.release_date).getTime()
    return dateA - dateB
  })
}
```

### Fetching Timeline Events
```typescript
export async function getTimelineEvents() {
  const { objects: events } = await cosmic.objects
    .find({ type: 'timeline-events' })
    .props('id,title,slug,metadata')
    .depth(1)
  
  return events.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime()
    const dateB = new Date(b.metadata.date).getTime()
    return dateA - dateB
  })
}
```

## Cosmic CMS Integration

This application integrates with your Cosmic CMS bucket containing:

- **Albums** - Complete discography with artwork and stories
- **Songs** - Lyrics, music videos, and fun facts  
- **Band Members** - Profiles, bios, and career information
- **Tours** - Concert history and memorable shows
- **Timeline Events** - Major milestones in band history

The content is automatically fetched and displayed using the Cosmic SDK, with all images optimized using imgix for fast loading.

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `bun run build`
2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js applications.

<!-- README_END -->