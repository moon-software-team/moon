export interface PlexLocation {
  id: number;
  path: string;
}

export interface PlexLibrary {
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: string;
  type: string;
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
  content: boolean;
  directory: boolean;
  contentChangedAt: number;
  hidden: number;
  location: PlexLocation[];
}

export interface PlexLibraryDetails {
  size: number;
  allowSync: boolean;
  art: string;
  content: string;
  identifier: string;
  librarySectionID: number;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  thumb: string;
  title1: string;
  viewGroup: string;
  Directory: {
    key: string;
    title: string;
  }[];
}

export interface PlexLibraries {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    title1: string;
    Directory: PlexLibrary[];
  };
}

export interface PlexError {
  errors: {
    code: number;
    message: string;
    status: number;
  }[];
}

export interface PlexPart {
  id: number;
  key: string;
  duration: number;
  file: string;
  size: number;
  container: string;
  videoProfile: string;
}

export interface PlexMedia {
  id: number;
  duration: number;
  bitrate: number;
  width: number;
  height: number;
  aspectRatio: number;
  audioChannels: number;
  audioCodec: string;
  videoCodec: string;
  videoResolution: string;
  container: string;
  videoFrameRate: string;
  videoProfile: string;
  Part: PlexPart[];
}

export interface PlexImage {
  alt: string;
  type: string;
  url: string;
}

export interface PlexUltraBlurColors {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

export interface PlexTag {
  tag: string;
}

export type PlexMetadataType = 'movie' | 'show' | 'season' | 'episode' | string;

export interface PlexMetadata {
  ratingKey: string;
  key: string;
  guid: string;
  slug: string;
  studio: string;
  type: PlexMetadataType;
  contentRating: string;
  summary: string;
  rating: number;
  audienceRating: number;
  year: number;
  tagline: string;
  thumb: string;
  art: string;
  duration: number;
  originallyAvailableAt: string;
  addedAt: number;
  updatedAt: number;
  audienceRatingImage: string;
  hasPremiumPrimaryExtra: string;
  ratingImage: string;
  Media: PlexMedia[];
  Image: PlexImage[];
  UltraBlurColors: PlexUltraBlurColors;
  Genre: PlexTag[];
  Country: PlexTag[];
  Director: PlexTag[];
  Writer: PlexTag[];
  Role: PlexTag[];
}

export interface PlexLibraryContent {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    content: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: string;
    Metadata: PlexMetadata[];
  };
}
