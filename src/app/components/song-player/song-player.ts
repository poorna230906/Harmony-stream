import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MusicService } from '../../services/music';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './song-player.html',
  styleUrl: './song-player.css'
})
export class SongPlayerComponent implements OnInit, OnDestroy {
  isPlaying = false;
  progress = 0;
  volume = 75;
  private subs = new Subscription();

  constructor(
    public musicService: MusicService,
    public audioService: AudioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subs.add(
      this.musicService.isPlaying$.subscribe(p => {
        this.isPlaying = p;
        this.cdr.detectChanges();
      })
    );
    this.subs.add(
      this.audioService.progress$.subscribe(p => {
        this.progress = p;
        this.cdr.detectChanges();
      })
    );
  }

  togglePlay() {
    if (!this.musicService.currentTrack()) return;
    if (this.isPlaying) {
      this.musicService.pause();
    } else {
      this.musicService.resume();
    }
  }

  next() { this.musicService.playNext(); }
  prev() { this.musicService.playPrev(); }

  onSeek(e: Event) {
    const val = +(e.target as HTMLInputElement).value;
    this.audioService.seek(val);
  }

  onVolume(e: Event) {
    const val = +(e.target as HTMLInputElement).value;
    this.audioService.setVolume(val);
    this.volume = val;
  }

  get currentTimeStr(): string {
    return this.audioService.formatTime(this.audioService.currentTime());
  }

  get durationStr(): string {
    const d = this.audioService.duration();
    if (d > 0) return this.audioService.formatTime(d);
    return this.musicService.currentTrack()?.duration ?? '0:00';
  }

  ngOnDestroy() { this.subs.unsubscribe(); }
}
