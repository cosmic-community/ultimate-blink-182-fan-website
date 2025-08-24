// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  thumbnail?: string;
}

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Band Members
export interface BandMember extends CosmicObject {
  type: 'band-members';
  metadata: {
    name: string;
    role: string;
    years_active?: string;
    bio?: string;
    profile_image?: {
      url: string;
      imgix_url: string;
    };
    fun_facts?: string;
  };
}

// Albums
export interface Album extends CosmicObject {
  type: 'albums';
  metadata: {
    title: string;
    release_date: string;
    album_art?: {
      url: string;
      imgix_url: string;
    };
    record_label?: string;
    producer?: string;
    album_story?: string;
    track_listing?: TrackInfo[];
    chart_performance?: string;
    era?: {
      key: string;
      value: string;
    };
  };
}

// Songs
export interface Song extends CosmicObject {
  type: 'songs';
  metadata: {
    title: string;
    album?: Album;
    writers?: string;
    length?: string;
    lyrics?: string;
    fun_facts?: string;
    music_video?: string;
    theme?: {
      key: string;
      value: string;
    };
  };
}

// Tours
export interface Tour extends CosmicObject {
  type: 'tours';
  metadata: {
    tour_name: string;
    year: string;
    tour_description?: string;
    notable_venues?: string;
    special_guests?: string;
    tour_poster?: {
      url: string;
      imgix_url: string;
    };
    highlights?: string;
  };
}

// Timeline Events
export interface TimelineEvent extends CosmicObject {
  type: 'timeline-events';
  metadata: {
    date: string;
    event_type: {
      key: string;
      value: string;
    };
    title: string;
    description?: string;
    related_image?: {
      url: string;
      imgix_url: string;
    };
    significance?: string;
  };
}

// Helper interfaces
export interface TrackInfo {
  track: number;
  title: string;
  length: string;
}

// Type guards
export function isBandMember(obj: CosmicObject): obj is BandMember {
  return obj.type === 'band-members';
}

export function isAlbum(obj: CosmicObject): obj is Album {
  return obj.type === 'albums';
}

export function isSong(obj: CosmicObject): obj is Song {
  return obj.type === 'songs';
}

export function isTour(obj: CosmicObject): obj is Tour {
  return obj.type === 'tours';
}

export function isTimelineEvent(obj: CosmicObject): obj is TimelineEvent {
  return obj.type === 'timeline-events';
}

// Era types
export type Era = 'original' | 'hiatus' | 'reunion' | 'skiba' | 'reunion2';

// Event types  
export type EventType = 'formation' | 'album_release' | 'tour' | 'lineup_change' | 'breakup' | 'reunion' | 'milestone';

// Theme types
export type SongTheme = 'pop_punk' | 'ska' | 'experimental' | 'acoustic' | 'humorous';