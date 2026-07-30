import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Quotation } from '../quotation/quotation';
import { AdminAuthService } from '../admin-auth.service';

interface DashboardTab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Quotation],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard {
  tabs: DashboardTab[] = [{ id: 'quotation', label: 'Quotation' }];
  activeTab = signal(this.tabs[0].id);

  constructor(
    private readonly authService: AdminAuthService,
    private readonly router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
