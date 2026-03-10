import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MusicService } from '../../services/music';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/music.model';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, UpperCasePipe],
  templateUrl: './artist-detail.html',
  styleUrl: './artist-detail.css'
})
export class ArtistDetail implements OnInit {
  artists: Artist[] = [];
  selectedArtist: Artist | null = null;

  constructor(
    private musicService: MusicService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.musicService.getArtists().subscribe(artists => {
      this.artists = artists;
      // Route param: /artists/:id
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.selectedArtist = artists.find(a => a.id === id) ?? null;
      }
    });
  }

  selectArtist(artist: Artist) { this.selectedArtist = artist; }
  clearSelection() { this.selectedArtist = null; }

  playSong(song: any) {
    this.musicService.play(song);
    this.userService.notify(`Now playing: ${song.title}`);
  }
}
