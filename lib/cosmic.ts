import { createBucketClient } from '@cosmicjs/sdk'
import type { Album, Song, BandMember, Tour, TimelineEvent } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Error helper
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all albums
export async function getAlbums(): Promise<Album[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'albums' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const albums = response.objects as Album[];
    
    return albums.sort((a, b) => {
      const dateA = new Date(a.metadata?.release_date || '').getTime();
      const dateB = new Date(b.metadata?.release_date || '').getTime();
      return dateA - dateB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch albums');
  }
}

// Fetch single album
export async function getAlbum(slug: string): Promise<Album | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'albums', slug })
      .depth(1);
    
    return response.object as Album;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch album');
  }
}

// Fetch all songs
export async function getSongs(): Promise<Song[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'songs' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Song[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch songs');
  }
}

// Fetch single song
export async function getSong(slug: string): Promise<Song | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'songs', slug })
      .depth(1);
    
    return response.object as Song;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch song');
  }
}

// Fetch all band members
export async function getBandMembers(): Promise<BandMember[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'band-members' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as BandMember[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch band members');
  }
}

// Fetch single band member
export async function getBandMember(slug: string): Promise<BandMember | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'band-members', slug })
      .depth(1);
    
    return response.object as BandMember;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch band member');
  }
}

// Fetch all tours
export async function getTours(): Promise<Tour[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'tours' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const tours = response.objects as Tour[];
    
    return tours.sort((a, b) => {
      const yearA = parseInt(a.metadata?.year || '0');
      const yearB = parseInt(b.metadata?.year || '0');
      return yearA - yearB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch tours');
  }
}

// Fetch single tour
export async function getTour(slug: string): Promise<Tour | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'tours', slug })
      .depth(1);
    
    return response.object as Tour;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch tour');
  }
}

// Fetch timeline events
export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'timeline-events' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const events = response.objects as TimelineEvent[];
    
    return events.sort((a, b) => {
      const dateA = new Date(a.metadata?.date || '').getTime();
      const dateB = new Date(b.metadata?.date || '').getTime();
      return dateA - dateB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch timeline events');
  }
}

// Fetch single timeline event
export async function getTimelineEvent(slug: string): Promise<TimelineEvent | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'timeline-events', slug })
      .depth(1);
    
    return response.object as TimelineEvent;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch timeline event');
  }
}

// Search functionality
export async function searchContent(query: string): Promise<{
  albums: Album[];
  songs: Song[];
  tours: Tour[];
}> {
  try {
    const [albumsResponse, songsResponse, toursResponse] = await Promise.all([
      cosmic.objects.find({ 
        type: 'albums',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'metadata.title': { $regex: query, $options: 'i' } }
        ]
      }).props(['id', 'title', 'slug', 'metadata']).depth(1),
      
      cosmic.objects.find({ 
        type: 'songs',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'metadata.title': { $regex: query, $options: 'i' } },
          { 'metadata.lyrics': { $regex: query, $options: 'i' } }
        ]
      }).props(['id', 'title', 'slug', 'metadata']).depth(1),
      
      cosmic.objects.find({ 
        type: 'tours',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'metadata.tour_name': { $regex: query, $options: 'i' } }
        ]
      }).props(['id', 'title', 'slug', 'metadata']).depth(1)
    ]);

    return {
      albums: albumsResponse.objects as Album[],
      songs: songsResponse.objects as Song[],
      tours: toursResponse.objects as Tour[]
    };
  } catch (error) {
    return {
      albums: [],
      songs: [],
      tours: []
    };
  }
}