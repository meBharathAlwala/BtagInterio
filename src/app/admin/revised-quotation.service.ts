import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RevisedQuotationItem {
  room: string;
  material: string;
  thickness: string;
  brand: string;
  quantity: number;
  rate: number;
}

export interface RevisedQuotationSnapshot {
  clientName: string;
  projectLocation: string;
  items: RevisedQuotationItem[];
  total: number;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class RevisedQuotationService {
  private readonly snapshotSubject = new BehaviorSubject<RevisedQuotationSnapshot>({
    clientName: '',
    projectLocation: '',
    items: [],
    total: 0,
    updatedAt: '',
  });
  private readonly activeTabSubject = new BehaviorSubject<string>('estimate');

  readonly snapshot$ = this.snapshotSubject.asObservable();
  readonly activeTab$ = this.activeTabSubject.asObservable();

  update(snapshot: RevisedQuotationSnapshot): void {
    this.snapshotSubject.next(snapshot);
  }

  setActiveTab(tabId: string): void {
    this.activeTabSubject.next(tabId);
  }

  openRevisedQuotationTab(): void {
    this.setActiveTab('revised-quotation');
  }

  getCurrent(): RevisedQuotationSnapshot {
    return this.snapshotSubject.getValue();
  }
}
