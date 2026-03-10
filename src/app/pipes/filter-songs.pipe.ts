import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/music.model';

@Pipe({ name: 'filterSongs', standalone: true })
export class FilterSongsPipe implements PipeTransform {
  transform(songs: Song[], query: string, filterBy: 'genre' | 'artist' | 'title' | 'all' = 'all'): Song[] {
    if (!query || query.trim() === '') return songs;
    const q = query.toLowerCase().trim();
    return songs.filter(song => {
      if (filterBy === 'genre') return song.genre.toLowerCase().includes(q);
      if (filterBy === 'artist') return song.artist.toLowerCase().includes(q);
      if (filterBy === 'title') return song.title.toLowerCase().includes(q);
      // 'all' - search everything
      return (
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.genre.toLowerCase().includes(q)
      );
    });
  }
}
