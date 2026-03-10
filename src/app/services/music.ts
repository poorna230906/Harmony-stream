import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Song, Artist, Playlist, Genre, Album } from '../models/music.model';
import { AudioService } from './audio.service';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private currentTrackSubject = new BehaviorSubject<Song | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();
  currentTrack = signal<Song | null>(null);

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  private songs: Song[] = [
    // ── Anirudh Ravichander ──
    { id: '1',  title: 'Hukum',               artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/4d/5a/73/4d5a7378b16e9da078963be5a30dc8cc.jpg', duration: '3:27', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2023-04-14') },
    { id: '2',  title: 'Arabic Kuthu',         artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/7a/85/b9/7a85b9e1a80d62c0e96f811577f01c0b.jpg', duration: '4:40', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2022-01-13') },
    { id: '3',  title: 'Fear Song',            artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/1200x/68/4e/64/684e64769d3a4f502bbb49458be6c137.jpg', duration: '3:15', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2016-07-15') },
    { id: '4',  title: 'Vaathi Coming',        artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/0f/9e/55/0f9e55055d6917497eac74614c184b7e.jpg', duration: '3:22', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2022-02-11') },
    { id: '5',  title: 'Manasilaayo',          artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/0f/9e/55/0f9e55055d6917497eac74614c184b7e.jpg', duration: '4:10', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2021-03-20') },
    { id: '6',  title: 'Kannaana Kanney',      artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/4d/5a/73/4d5a7378b16e9da078963be5a30dc8cc.jpg', duration: '4:55', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2019-11-01') },
    { id: '7',  title: 'Enjoy Enjaami',        artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/7a/85/b9/7a85b9e1a80d62c0e96f811577f01c0b.jpg', duration: '5:05', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2021-03-05') },
    { id: '8',  title: 'Rowdy Baby',           artist: 'Dhanush & Dhee',      coverUrl: 'https://i.pinimg.com/1200x/4f/a5/c2/4fa5c283694296faf9447159cccd7843.jpg', duration: '4:44', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2018-09-28') },

    // ── Arijit Singh ──
    { id: '9',  title: 'Tum Hi Ho',            artist: 'Arijit Singh',        coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '4:22', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2013-01-25') },
    { id: '10', title: 'Kesariya',             artist: 'Arijit Singh',        coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '4:28', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2022-07-01') },
    { id: '11', title: 'Chaleya',              artist: 'Arijit Singh',        coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '3:55', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2023-06-30') },
    { id: '12', title: 'Apna Bana Le',         artist: 'Arijit Singh',        coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '4:12', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2023-05-25') },
    { id: '13', title: 'Tera Ban Jaunga',      artist: 'Arijit Singh',        coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '3:58', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2019-07-19') },
    { id: '14', title: 'Humnava Mere',         artist: 'Arijit Singh',        coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '4:31', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2017-11-10') },

    // ── Sid Sriram ──
    { id: '15', title: 'Kadalalle',            artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:15', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2021-01-15') },
    { id: '16', title: 'Srivalli',             artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '3:50', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2021-12-24') },
    { id: '17', title: 'Nee Neruppa Da',       artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:08', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2022-03-11') },
    { id: '18', title: 'Dooriya',              artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '3:42', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2022-10-05') },

    // ── Sanjith Hegde ──
    { id: '19', title: 'Marali Manasaagide',   artist: 'Sanjith Hegde',       coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:11', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2022-06-10') },
    { id: '20', title: 'Ninna Nenapu',         artist: 'Sanjith Hegde',       coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:02', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2021-08-20') },
    { id: '21', title: 'Kannale',              artist: 'Sanjith Hegde',       coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '3:48', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2023-02-14') },

    // ── Sushin Shyam ──
    { id: '22', title: 'Beevi',                artist: 'Sushin Shyam',        coverUrl: 'https://s.mxmcdn.net/images-storage/albums2/0/5/4/6/3/3/78336450_350_350.jpg', duration: '3:52', genre: Genre.Pop,  audioUrl: '', releaseDate: new Date('2022-05-19') },
    { id: '23', title: 'Illuminati',           artist: 'Sushin Shyam',        coverUrl: 'https://i.pinimg.com/1200x/03/c6/84/03c684a36cb174b3adf2c0230afdc901.jpg', duration: '3:45', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2022-09-30') },
    { id: '24', title: 'Pathonpatham Noottandu', artist: 'Sushin Shyam',      coverUrl: 'https://s.mxmcdn.net/images-storage/albums2/0/5/4/6/3/3/78336450_350_350.jpg', duration: '4:20', genre: Genre.Melody, audioUrl: '', releaseDate: new Date('2023-01-26') },

    // ── Armaan Malik ──
    { id: '25', title: 'Butta Bomma',          artist: 'Armaan Malik',        coverUrl: 'https://i.pinimg.com/1200x/44/48/84/444884d4175aa5d0646f181aa8d88733.jpg', duration: '3:17', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2020-01-12') },
    { id: '26', title: 'Main Rang Sharbaton',  artist: 'Armaan Malik',        coverUrl: 'https://i.pinimg.com/1200x/44/48/84/444884d4175aa5d0646f181aa8d88733.jpg', duration: '4:05', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2014-05-30') },
    { id: '27', title: 'Hua Hain Aaj Pehli Baar', artist: 'Armaan Malik',    coverUrl: 'https://i.pinimg.com/1200x/44/48/84/444884d4175aa5d0646f181aa8d88733.jpg', duration: '3:48', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2016-08-12') },

    // ── Thaman S ──
    { id: '28', title: 'Kurchi Madathapetti',  artist: 'Thaman S',            coverUrl: 'https://i.pinimg.com/736x/de/c7/b5/dec7b51006ba02563a14569ea02efc2f.jpg', duration: '3:35', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2023-07-06') },
    { id: '29', title: 'Oo Antava',            artist: 'Thaman S',            coverUrl: 'https://i.pinimg.com/736x/de/c7/b5/dec7b51006ba02563a14569ea02efc2f.jpg', duration: '3:55', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2022-01-07') },
    { id: '30', title: 'Saami Saami',          artist: 'Mounika Yadav',       coverUrl: 'https://i.pinimg.com/1200x/4f/a5/c2/4fa5c283694296faf9447159cccd7843.jpg', duration: '3:48', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2021-11-05') },

    // ── Other artists ──
    { id: '31', title: 'Naatu Naatu',          artist: 'Rahul Sipligunj',     coverUrl: 'https://i.pinimg.com/736x/7a/85/b9/7a85b9e1a80d62c0e96f811577f01c0b.jpg', duration: '4:04', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2022-03-25') },
    { id: '32', title: 'Raataan Lambiyan',     artist: 'Jubin Nautiyal',      coverUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', duration: '3:40', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2021-07-24') },
    { id: '33', title: 'Katchi Sera',          artist: 'Sai Abhyankkar',      coverUrl: 'https://i.pinimg.com/736x/c5/cb/b8/c5cbb8f53ed493aae4a1aa4a23fa3f1d.jpg', duration: '3:05', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2021-10-01') },
    { id: '34', title: 'Ninnindale',           artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:30', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2023-08-15') },
    { id: '35', title: 'Nenjame',              artist: 'Sanjith Hegde',       coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '3:55', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2023-04-22') },
    { id: '36', title: 'Maruvaarthai',         artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:18', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2016-09-09') },
    { id: '37', title: 'Vaa Vaathiyare',       artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/4d/5a/73/4d5a7378b16e9da078963be5a30dc8cc.jpg', duration: '3:28', genre: Genre.Pop,     audioUrl: '', releaseDate: new Date('2023-10-10') },
    { id: '38', title: 'Petta Paraak',         artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/1200x/68/4e/64/684e64769d3a4f502bbb49458be6c137.jpg', duration: '3:44', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2019-01-10') },
    { id: '39', title: 'Thalli Pogathey',      artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:35', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2014-04-25') },
    { id: '40', title: 'Uyire',                artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:50', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2022-06-23') },
    { id: '41', title: 'Kaattu Payale',        artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/4d/5a/73/4d5a7378b16e9da078963be5a30dc8cc.jpg', duration: '3:50', genre: Genre.Rock,     audioUrl: '', releaseDate: new Date('2020-01-09') },
    { id: '42', title: 'Paal Poove',           artist: 'Sanjith Hegde',       coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:02', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2022-12-01') },
    { id: '43', title: 'Kaaney Kaaney',        artist: 'Sid Sriram',          coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '5:10', genre: Genre.Melody,   audioUrl: '', releaseDate: new Date('2017-08-30') },
    { id: '44', title: 'Chinna Chinna Asai',   artist: 'Sanjith Hegde',       coverUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', duration: '4:45', genre: Genre.Classical, audioUrl: '', releaseDate: new Date('2021-05-10') },
    { id: '45', title: 'Naan Un',              artist: 'Anirudh Ravichander', coverUrl: 'https://i.pinimg.com/736x/4d/5a/73/4d5a7378b16e9da078963be5a30dc8cc.jpg', duration: '3:38', genre: Genre.Romantic, audioUrl: '', releaseDate: new Date('2022-04-14') },
  ];

  private artists: Artist[] = [
    { id: 'a1', name: 'Anirudh Ravichander', bio: 'Tamil film composer & singer known for high-energy beats and genre-defying soundscapes. Composer of Leo, Vikram, Jailer and more.', imageUrl: 'https://i.pinimg.com/736x/4d/5a/73/4d5a7378b16e9da078963be5a30dc8cc.jpg', topTracks: [] },
    { id: 'a2', name: 'Arijit Singh',        bio: 'Bollywood\'s most beloved voice — soulful, emotive, and instantly recognizable. Known for Tum Hi Ho, Kesariya, Ae Dil Hai Mushkil.', imageUrl: 'https://i.pinimg.com/1200x/e0/e6/40/e0e6403095a8956225e217c52363a17c.jpg', topTracks: [] },
    { id: 'a3', name: 'Sanjith Hegde',       bio: 'Kannada playback sensation with a rich, melodious voice perfectly suited for romantic and devotional tracks.', imageUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', topTracks: [] },
    { id: 'a4', name: 'Sushin Shyam',        bio: 'Malayalam composer pushing boundaries with experimental and deeply cinematic music. Known for Kumbalangi Nights.', imageUrl: 'https://s.mxmcdn.net/images-storage/albums2/0/5/4/6/3/3/78336450_350_350.jpg', topTracks: [] },
    { id: 'a5', name: 'Sid Sriram',          bio: 'American-Tamil singer-composer known for soulful Carnatic-influenced indie pop. Every song is an emotional journey.', imageUrl: 'https://i.pinimg.com/736x/5b/cd/0d/5bcd0d42c7e7d4868dc3e8a3d403b68f.jpg', topTracks: [] },
    { id: 'a6', name: 'Armaan Malik',        bio: 'Versatile Bollywood singer known for both peppy chartbusters and soft romantic melodies across multiple languages.', imageUrl: 'https://i.pinimg.com/1200x/44/48/84/444884d4175aa5d0646f181aa8d88733.jpg', topTracks: [] },
  ];

  private playlists: Playlist[] = [];

  constructor(private http: HttpClient, private audioService: AudioService) {
    this.artists[0].topTracks = this.songs.filter(s => s.artist === 'Anirudh Ravichander');
    this.artists[1].topTracks = this.songs.filter(s => s.artist === 'Arijit Singh');
    this.artists[2].topTracks = this.songs.filter(s => s.artist === 'Sanjith Hegde');
    this.artists[3].topTracks = this.songs.filter(s => s.artist === 'Sushin Shyam');
    this.artists[4].topTracks = this.songs.filter(s => s.artist === 'Sid Sriram');
    this.artists[5].topTracks = this.songs.filter(s => s.artist === 'Armaan Malik');
  }

  getSongs(): Observable<Song[]> { return of(this.songs).pipe(catchError(() => of([]))); }
  getArtists(): Observable<Artist[]> { return of(this.artists).pipe(catchError(() => of([]))); }
  getArtistById(id: string): Observable<Artist | undefined> { return of(this.artists.find(a => a.id === id)); }
  getPlaylists(): Observable<Playlist[]> { return of(this.playlists).pipe(catchError(() => of([]))); }

  createPlaylist(name: string, description: string): Observable<Playlist> {
    const p: Playlist = { id: Date.now().toString(), name, description, songs: [], createdAt: new Date() };
    this.playlists.push(p);
    return of(p);
  }
  addSongToPlaylist(playlistId: string, song: Song): Observable<boolean> {
    const pl = this.playlists.find(p => p.id === playlistId);
    if (pl && !pl.songs.find(s => s.id === song.id)) { pl.songs.push(song); return of(true); }
    return of(false);
  }
  removeSongFromPlaylist(playlistId: string, songId: string): Observable<boolean> {
    const pl = this.playlists.find(p => p.id === playlistId);
    if (pl) { pl.songs = pl.songs.filter(s => s.id !== songId); return of(true); }
    return of(false);
  }
  deletePlaylist(playlistId: string): Observable<boolean> {
    this.playlists = this.playlists.filter(p => p.id !== playlistId);
    return of(true);
  }

  play(song: Song) {
    this.currentTrack.set(song);
    this.currentTrackSubject.next(song);
    this.isPlayingSubject.next(true);
    this.audioService.loadSong(song.duration, song.audioUrl || '');
    this.audioService.play();
  }
  pause() { this.isPlayingSubject.next(false); this.audioService.pause(); }
  resume() { this.isPlayingSubject.next(true); this.audioService.play(); }
  playNext() {
    const cur = this.currentTrackSubject.value;
    if (!cur) return;
    const idx = this.songs.findIndex(s => s.id === cur.id);
    this.play(this.songs[(idx + 1) % this.songs.length]);
  }
  playPrev() {
    const cur = this.currentTrackSubject.value;
    if (!cur) return;
    const idx = this.songs.findIndex(s => s.id === cur.id);
    this.play(this.songs[(idx - 1 + this.songs.length) % this.songs.length]);
  }
  updateProgress(value: number) { this.progressSubject.next(value); }
}
