// 1. Enums: Restricting data to specific categories
export enum Genre {
  Pop = 'Pop',
  Rock = 'Rock',
  Jazz = 'Jazz',
  Classical = 'Classical',
  Romantic = 'Romantic',
  Melody = 'Melody'
}

// 2. Base Class: Using Access Modifiers (public)
export class Media {
  constructor(
    public id: string,
    public title: string,
    public coverUrl: string
  ) {}
}

// 3. Song interface extending Media (Inheritance via interface)
export interface Song extends Media {
  artist: string;
  duration: string;
  genre: Genre;
  audioUrl: string;
  releaseDate?: Date;
}

// 4. Additional Interfaces
export interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  topTracks: Song[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  volume: number;
  lastPlayedSong?: Song;
}
