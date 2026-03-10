import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe, DatePipe } from '@angular/common';
import { MusicService } from '../../services/music';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  imports: [CommonModule, UpperCasePipe, DatePipe],
  templateUrl: './now-playing.html',
  styleUrl: './now-playing.css'
})
export class NowPlayingComponent implements OnInit {
  progress = 0;

  constructor(public musicService: MusicService, public audioService: AudioService) {}

  ngOnInit() {
    this.audioService.progress$.subscribe(p => this.progress = p);
  }

  toggle() { this.audioService.toggle(); }
  next() { this.musicService.playNext(); }
  prev() { this.musicService.playPrev(); }
  onSeek(e: Event) { this.audioService.seek(+(e.target as HTMLInputElement).value); }
  onVolume(e: Event) { this.audioService.setVolume(+(e.target as HTMLInputElement).value); }
}
