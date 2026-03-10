import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  navTitle = 'Harmony Stream';
  constructor(public userService: UserService) {}

  toggleTheme() { this.userService.toggleTheme(); }
  logout() { this.userService.logout(); }
}
