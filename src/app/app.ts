import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SongPlayerComponent } from './components/song-player/song-player';
import { NavbarComponent } from './components/navbar/navbar';
import { NotificationComponent } from './components/notification/notification';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SongPlayerComponent, NavbarComponent, NotificationComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit() {
    // Apply saved theme on startup
    const isDark = this.userService.isDarkMode();
    document.body.classList.toggle('light-mode', !isDark);
  }
}
