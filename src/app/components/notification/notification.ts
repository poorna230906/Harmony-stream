import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notif-container">
      @for (msg of notifications; track msg) {
        <div class="snackbar">
          <span class="snack-dot"></span>
          {{ msg }}
        </div>
      }
    </div>
  `,
  styles: [`
    .notif-container {
      position: fixed; bottom: 110px; left: 50%; transform: translateX(-50%);
      z-index: 2000; display: flex; flex-direction: column; gap: 8px; align-items: center;
    }
    .snackbar {
      background: #1a0000;
      border: 1px solid rgba(192,57,43,0.4);
      color: #fff;
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 0.88rem; font-weight: 600;
      box-shadow: 0 4px 24px rgba(139,0,0,0.3);
      display: flex; align-items: center; gap: 10px;
      white-space: nowrap;
      animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .snack-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #c0392b;
      box-shadow: 0 0 8px rgba(192,57,43,0.7);
      flex-shrink: 0;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: string[] = [];
  constructor(private userService: UserService) {}
  ngOnInit() { this.userService.notifications$.subscribe(msgs => this.notifications = msgs); }
}
