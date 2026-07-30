import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
})
export class AdminLogin {
  username = '';
  password = '';
  error = signal(false);

  constructor(
    private readonly authService: AdminAuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      this.error.set(false);
      this.router.navigate(['/admin']);
    } else {
      this.error.set(true);
    }
  }
}
