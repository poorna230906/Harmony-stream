import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio = new Audio();
  private simulationInterval: any = null;
  private simulatedTime = 0;
  private simulatedDuration = 0;

  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(75);

  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      const prog = this.audio.duration ? (this.audio.currentTime / this.audio.duration) * 100 : 0;
      this.currentTime.set(Math.floor(this.audio.currentTime));
      this.progressSubject.next(prog);
    });
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(Math.floor(this.audio.duration));
    });
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.stopSimulation();
    });
    this.audio.volume = 0.75;
  }

  private parseDuration(dur: string): number {
    const parts = dur.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }

  loadSong(durationStr: string, audioUrl?: string) {
    this.stopSimulation();
    this.simulatedTime = 0;
    this.simulatedDuration = this.parseDuration(durationStr || '3:30');
    this.currentTime.set(0);
    this.duration.set(this.simulatedDuration);
    this.progressSubject.next(0);

    if (audioUrl) {
      this.audio.src = audioUrl;
      this.audio.load();
    }
  }

  private startSimulation() {
    this.stopSimulation();
    this.simulationInterval = setInterval(() => {
      if (this.simulatedTime < this.simulatedDuration) {
        this.simulatedTime += 1;
        this.currentTime.set(this.simulatedTime);
        const prog = (this.simulatedTime / this.simulatedDuration) * 100;
        this.progressSubject.next(prog);
      } else {
        this.isPlaying.set(false);
        this.stopSimulation();
      }
    }, 1000);
  }

  private stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  play() {
    if (this.audio.src && this.audio.readyState >= 2) {
      this.audio.play().catch(() => this.startSimulation());
    } else {
      this.startSimulation();
    }
    this.isPlaying.set(true);
  }

  pause() {
    this.audio.pause();
    this.stopSimulation();
    this.isPlaying.set(false);
  }

  toggle() {
    this.isPlaying() ? this.pause() : this.play();
  }

  setVolume(vol: number) {
    this.audio.volume = vol / 100;
    this.volume.set(vol);
  }

  seek(percent: number) {
    this.simulatedTime = Math.floor((percent / 100) * this.simulatedDuration);
    this.currentTime.set(this.simulatedTime);
    this.progressSubject.next(percent);
    if (this.audio.duration) {
      this.audio.currentTime = (percent / 100) * this.audio.duration;
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
