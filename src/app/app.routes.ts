import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/song-list/song-list').then(m => m.SongListComponent)
  },
  {
    path: 'artists',
    loadComponent: () =>
      import('./components/artist-detail/artist-detail').then(m => m.ArtistDetail)
  },
  {
    path: 'artists/:id',
    loadComponent: () =>
      import('./components/artist-detail/artist-detail').then(m => m.ArtistDetail)
  },
  {
    path: 'playlists',
    loadComponent: () =>
      import('./components/playlist-manager/playlist-manager').then(m => m.PlaylistManager)
  },
  {
    path: 'now-playing',
    loadComponent: () =>
      import('./components/now-playing/now-playing').then(m => m.NowPlayingComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];
