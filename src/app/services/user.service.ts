import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserPreferences } from '../models/music.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private prefsSubject = new BehaviorSubject<UserPreferences>({ theme: 'dark', volume: 75 });
  preferences$ = this.prefsSubject.asObservable();

  isDarkMode = signal<boolean>(true);
  isLoggedIn = signal<boolean>(false);
  username = signal<string>('');

  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  login(email: string, password: string): Observable<boolean> {
    // Simulate login
    if (email && password) {
      const name = email.split('@')[0];
      this.username.set(name);
      this.isLoggedIn.set(true);
      return of(true);
    }
    return of(false);
  }

  logout() {
    this.username.set('');
    this.isLoggedIn.set(false);
  }

  toggleTheme() {
    const current = this.prefsSubject.value;
    const newTheme: 'dark' | 'light' = current.theme === 'dark' ? 'light' : 'dark';
    this.prefsSubject.next({ ...current, theme: newTheme });
    this.isDarkMode.set(newTheme === 'dark');
    document.body.classList.toggle('light-mode', newTheme === 'light');
  }

  notify(message: string) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, message]);
    // Auto dismiss after 3s
    setTimeout(() => {
      const updated = this.notificationsSubject.value.filter(m => m !== message);
      this.notificationsSubject.next(updated);
    }, 3000);
  }

  updateVolume(vol: number) {
    const current = this.prefsSubject.value;
    this.prefsSubject.next({ ...current, volume: vol });
  }
}
