import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusicService } from '../../services/music';
import { UserService } from '../../services/user.service';
import { Playlist, Song } from '../../models/music.model';

@Component({
  selector: 'app-playlist-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './playlist-manager.html',
  styleUrl: './playlist-manager.css'
})
export class PlaylistManager implements OnInit {
  playlists: Playlist[] = [];
  songs: Song[] = [];
  selectedPlaylist: Playlist | null = null;
  showCreateForm = false;

  // Reactive form for playlist creation
  playlistForm: FormGroup;

  constructor(
    private musicService: MusicService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.playlistForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.musicService.getPlaylists().subscribe(pl => this.playlists = pl);
    this.musicService.getSongs().subscribe(songs => this.songs = songs);
  }

  get nameControl() { return this.playlistForm.get('name')!; }
  get descControl() { return this.playlistForm.get('description')!; }

  createPlaylist() {
    if (this.playlistForm.valid) {
      const { name, description } = this.playlistForm.value;
      this.musicService.createPlaylist(name, description).subscribe(pl => {
        this.playlists.push(pl);
        this.playlistForm.reset();
        this.showCreateForm = false;
        this.userService.notify(`Playlist "${pl.name}" created!`);
      });
    } else {
      this.playlistForm.markAllAsTouched();
    }
  }

  selectPlaylist(pl: Playlist) { this.selectedPlaylist = pl; }
  clearSelection() { this.selectedPlaylist = null; }

  addSong(song: Song) {
    if (!this.selectedPlaylist) return;
    this.musicService.addSongToPlaylist(this.selectedPlaylist.id, song).subscribe(added => {
      if (added) {
        this.selectedPlaylist!.songs.push(song);
        this.userService.notify(`"${song.title}" added to playlist!`);
      } else {
        this.userService.notify(`"${song.title}" is already in this playlist.`);
      }
    });
  }

  removeSong(songId: string) {
    if (!this.selectedPlaylist) return;
    this.musicService.removeSongFromPlaylist(this.selectedPlaylist.id, songId).subscribe(() => {
      this.selectedPlaylist!.songs = this.selectedPlaylist!.songs.filter(s => s.id !== songId);
      this.userService.notify('Song removed from playlist.');
    });
  }

  deletePlaylist(plId: string) {
    this.musicService.deletePlaylist(plId).subscribe(() => {
      this.playlists = this.playlists.filter(p => p.id !== plId);
      this.selectedPlaylist = null;
      this.userService.notify('Playlist deleted.');
    });
  }

  playSong(song: Song) {
    this.musicService.play(song);
    this.userService.notify(`Now playing: ${song.title}`);
  }

  availableSongs(): Song[] {
    if (!this.selectedPlaylist) return [];
    const inPlaylist = this.selectedPlaylist.songs.map(s => s.id);
    return this.songs.filter(s => !inPlaylist.includes(s.id));
  }
}
