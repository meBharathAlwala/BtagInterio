import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketingCenter } from '../marketing-center/marketing-center';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MarketingCenter],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
  username = '';
  password = '';
  error = '';
  isLoggedIn = false;

  private readonly validUsername = 'btag';
  private readonly validPassword = 'btag@321';

  login(): void {
    this.error = '';

    if (this.username.trim().toLowerCase() === this.validUsername && this.password === this.validPassword) {
      this.isLoggedIn = true;
      return;
    }

    this.error = 'Invalid username or password.';
  }

  logout(): void {
    this.isLoggedIn = false;
    this.username = '';
    this.password = '';
    this.error = '';
  }
}
