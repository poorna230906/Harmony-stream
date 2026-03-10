import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = signal<string>('');

  constructor(private userService: UserService, private router: Router) {}

  // Template-driven form submission
  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.userService.login(this.email, this.password).subscribe(success => {
      if (success) {
        this.userService.notify(`Welcome back, ${this.userService.username()}!`);
        this.router.navigate(['/']);
      } else {
        this.errorMsg.set('Invalid credentials. Please try again.');
      }
    });
  }
}
