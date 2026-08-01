import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Quotation } from '../quotation/quotation';
import { Measurements } from '../measurements/measurements';
import { MaterialEstimate } from '../material-estimate/material-estimate';
import { RevisedQuotation } from '../revised-quotation/revised-quotation';
import { EstimateCharts } from '../estimate-charts/estimate-charts';
import { AdminAuthService } from '../admin-auth.service';
import { RevisedQuotationService, RevisedQuotationSnapshot } from '../revised-quotation.service';

interface DashboardTab {
  id: string;
  label: string;
  hint: string;
  icon: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Quotation, Measurements, MaterialEstimate, RevisedQuotation, EstimateCharts],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnDestroy {
  revisedSnapshot: RevisedQuotationSnapshot = {
    clientName: '',
    projectLocation: '',
    items: [],
    total: 0,
    updatedAt: '',
  };

  tabs: DashboardTab[] = [
    { id: 'quotation', label: 'Quotation', hint: 'Create and manage client quotes', icon: 'fa-file-invoice' },
    { id: 'measurements', label: 'Measurements', hint: 'Room dimensions and area sheets', icon: 'fa-ruler-combined' },
    { id: 'estimate', label: 'Material Estimate', hint: 'Room-wise material costing', icon: 'fa-calculator' },
    { id: 'revised-quotation', label: 'Revised Quotation', hint: 'Live quotation from estimate inputs', icon: 'fa-file-contract' },
    { id: 'estimate-charts', label: 'Estimate Charts', hint: 'Section and material totals at a glance', icon: 'fa-chart-column' },
  ];
  activeTab = signal('estimate');
  showConverterPopup = signal(false);

  readonly measurementUnits = ['mm', 'cm', 'inch', 'feet'];
  converterValue: number | null = null;
  converterFromUnit = 'mm';
  converterToUnit = 'inch';

  converterTab: 'unit' | 'area' = 'unit';
  areaLength: number | null = null;
  areaWidth: number | null = null;
  areaUnit = 'feet';

  private readonly subscriptions = new Subscription();

  private readonly unitToMm: Record<string, number> = {
    mm: 1,
    cm: 10,
    inch: 25.4,
    feet: 304.8,
  };

  constructor(
    private readonly authService: AdminAuthService,
    private readonly router: Router,
    private readonly revisedQuotationService: RevisedQuotationService,
  ) {
    this.subscriptions.add(
      this.revisedQuotationService.activeTab$.subscribe((tabId) => {
        this.activeTab.set(tabId);
      }),
    );

    this.subscriptions.add(
      this.revisedQuotationService.snapshot$.subscribe((snapshot) => {
        this.revisedSnapshot = snapshot;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onRevisedQuotationRequested(snapshot: RevisedQuotationSnapshot): void {
    this.revisedSnapshot = snapshot;
    this.activeTab.set('revised-quotation');
  }

  get convertedValue(): number | null {
    if (this.converterValue === null || this.converterValue === undefined || isNaN(this.converterValue)) {
      return null;
    }

    const valueInMm = this.converterValue * this.unitToMm[this.converterFromUnit];
    return valueInMm / this.unitToMm[this.converterToUnit];
  }

  swapConverterUnits(): void {
    const previousFrom = this.converterFromUnit;
    this.converterFromUnit = this.converterToUnit;
    this.converterToUnit = previousFrom;
  }

  get areaInSqFt(): number | null {
    if (!this.areaLength || !this.areaWidth || isNaN(this.areaLength) || isNaN(this.areaWidth)) {
      return null;
    }

    const mmPerFoot = this.unitToMm['feet'];
    const lengthInFeet = (this.areaLength * this.unitToMm[this.areaUnit]) / mmPerFoot;
    const widthInFeet = (this.areaWidth * this.unitToMm[this.areaUnit]) / mmPerFoot;
    return lengthInFeet * widthInFeet;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  openConverterPopup(): void {
    this.showConverterPopup.set(true);
  }

  closeConverterPopup(): void {
    this.showConverterPopup.set(false);
  }
}
