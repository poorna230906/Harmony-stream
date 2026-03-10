import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Song, Genre } from '../../models/music.model';
import { MusicService } from '../../services/music';
import { UserService } from '../../services/user.service';
import { HighlightPlayingDirective } from '../../directives/highlight-playing.directive';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HighlightPlayingDirective, DatePipe, UpperCasePipe],
  templateUrl: './song-list.html',
  styleUrl: './song-list.css'
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];
  featuredSongs: Song[] = [];
  trendingSongs: Song[] = [];
  romanticSongs: Song[] = [];
  rockSongs: Song[] = [];
  recentSongs: Song[] = [];
  melodySongs: Song[] = [];
  artistGroups: { name: string; songs: Song[] }[] = [];

  constructor(
    public musicService: MusicService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.musicService.getSongs().subscribe(songs => {
      this.songs = songs;
      this.featuredSongs    = songs.slice(0, 6);
      this.trendingSongs    = songs.filter(s => s.releaseDate && s.releaseDate.getFullYear() >= 2022).slice(0, 10);
      this.romanticSongs    = songs.filter(s => s.genre === Genre.Romantic);
      this.rockSongs        = songs.filter(s => s.genre === Genre.Rock || s.genre === Genre.Pop).slice(0, 10);
      this.recentSongs      = [...songs].sort((a,b) => (b.releaseDate?.getTime()||0) - (a.releaseDate?.getTime()||0)).slice(0, 12);
      this.melodySongs      = songs.filter(s => s.genre === Genre.Melody || s.genre === Genre.Classical);

      const artistNames = [...new Set(songs.map(s => s.artist))].slice(0, 4);
      this.artistGroups = artistNames.map(name => ({
        name,
        songs: songs.filter(s => s.artist === name).slice(0, 4)
      }));
    });
  }

  playSong(song: Song) {
    this.musicService.play(song);
    this.userService.notify(`♪  ${song.title} — ${song.artist}`);
  }

  isPlaying(song: Song): boolean {
    return this.musicService.currentTrack()?.id === song.id;
  }

  getGenreColor(genre: Genre): string {
    const map: Record<string, string> = {
      Pop: '#c0392b', Rock: '#e74c3c', Romantic: '#8b0000',
      Jazz: '#a50000', Classical: '#d35400', Melody: '#922b21'
    };
    return map[genre] || '#c0392b';
  }
}
