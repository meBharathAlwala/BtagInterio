import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CLIENT_CONFIG, ClientConfig } from '../../client.config';

interface QuotationItem {
  description: string;
  quantity: number;
  rate: number;
}

interface SavedQuotation {
  id: number;
  customerName: string;
  customerPhone: string;
  projectLocation: string;
  items: QuotationItem[];
  total: number;
  createdAt: string;
}

const STORAGE_KEY = 'btag_admin_quotations';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotation.html',
  styleUrls: ['./quotation.css'],
})
export class Quotation {
  customerName = '';
  customerPhone = '';
  projectLocation = '';
  items: QuotationItem[] = [{ description: '', quantity: 1, rate: 0 }];

  readonly itemSuggestions = [
    'TV Unit',
    'Modular Kitchen',
    'MBR Wardrobe',
    'CBR Wardrobe',
    'PBR Wardrobe',
    'Shoe Rack',
    'Main Door Panel',
    'False Ceiling',
    'Workstation',
    'Crockery Unit',
  ];

  savedQuotations = signal<SavedQuotation[]>([]);

  readonly measurementUnits = ['mm', 'cm', 'inch', 'feet'];
  converterValue: number | null = null;
  converterFromUnit = 'mm';
  converterToUnit = 'inch';

  converterTab: 'unit' | 'area' = 'unit';
  areaLength: number | null = null;
  areaWidth: number | null = null;
  areaUnit = 'feet';

  private readonly unitToMm: Record<string, number> = {
    mm: 1,
    cm: 10,
    inch: 25.4,
    feet: 304.8,
  };

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig,
  ) {
    this.loadSaved();
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
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

  addItem(): void {
    this.items.push({ description: '', quantity: 1, rate: 0 });
  }

  addSuggestedItem(description: string): void {
    const lastItem = this.items[this.items.length - 1];
    if (lastItem && !lastItem.description.trim()) {
      lastItem.description = description;
    } else {
      this.items.push({ description, quantity: 1, rate: 0 });
    }
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  saveQuotation(): void {
    const hasDescription = this.items.some((item) => item.description.trim());
    if (!this.customerName.trim() || !hasDescription) {
      return;
    }

    const quotation: SavedQuotation = {
      id: Date.now(),
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      projectLocation: this.projectLocation.trim(),
      items: this.items.map((item) => ({ ...item })),
      total: this.total,
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = [quotation, ...this.savedQuotations()];
    this.savedQuotations.set(updated);
    this.persist(updated);
    this.resetForm();
  }

  deleteQuotation(id: number): void {
    const updated = this.savedQuotations().filter((quotation) => quotation.id !== id);
    this.savedQuotations.set(updated);
    this.persist(updated);
  }

  downloadCurrentPdf(): void {
    const quotation = this.buildCurrentSnapshot();
    if (!quotation) {
      return;
    }

    this.downloadPdf(quotation);
  }

  downloadPdf(quotation: SavedQuotation): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(this.clientConfig.name, 14, 18);
    doc.setFontSize(10);
    doc.text(
      `${this.clientConfig.contact.location} | ${this.clientConfig.contact.phone} | ${this.clientConfig.contact.email}`,
      14,
      25,
    );

    doc.setFontSize(13);
    doc.text('Quotation', 14, 38);

    doc.setFontSize(10);
    doc.text(`Date: ${quotation.createdAt}`, 14, 45);
    doc.text(`Customer: ${quotation.customerName}`, 14, 51);
    if (quotation.customerPhone) {
      doc.text(`Phone: ${quotation.customerPhone}`, 14, 57);
    }
    if (quotation.projectLocation) {
      doc.text(`Project Location: ${quotation.projectLocation}`, 14, 63);
    }

    autoTable(doc, {
      startY: 70,
      head: [['Description', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)']],
      body: quotation.items.map((item) => [
        item.description,
        String(item.quantity),
        item.rate.toFixed(2),
        (item.quantity * item.rate).toFixed(2),
      ]),
      foot: [['', '', 'Total', quotation.total.toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: [123, 94, 167] },
      footStyles: { fillColor: [244, 244, 244], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    const safeName = quotation.customerName.replace(/[^a-z0-9]+/gi, '_') || 'quotation';
    doc.save(`Quotation_${safeName}_${this.toFileDate(quotation.id)}.pdf`);
  }

  downloadCurrentExcel(): void {
    const quotation = this.buildCurrentSnapshot();
    if (!quotation) {
      return;
    }

    this.downloadExcel(quotation);
  }

  downloadExcel(quotation: SavedQuotation): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rows: (string | number)[][] = [
      [this.clientConfig.name],
      [`${this.clientConfig.contact.location} | ${this.clientConfig.contact.phone} | ${this.clientConfig.contact.email}`],
      [],
      ['Date', quotation.createdAt],
      ['Customer', quotation.customerName],
      ['Phone', quotation.customerPhone || '-'],
      ['Project Location', quotation.projectLocation || '-'],
      [],
      ['Description', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)'],
      ...quotation.items.map((item) => [
        item.description,
        item.quantity,
        item.rate.toFixed(2),
        (item.quantity * item.rate).toFixed(2),
      ]),
      [],
      ['', '', 'Total', quotation.total.toFixed(2)],
    ];

    const csvContent = rows.map((row) => row.map((cell) => this.toCsvField(cell)).join(',')).join('\r\n');
    // Prepend a UTF-8 BOM so Excel opens the file with correct encoding (e.g. the ₹ symbol).
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const safeName = quotation.customerName.replace(/[^a-z0-9]+/gi, '_') || 'quotation';
    const link = document.createElement('a');
    link.href = url;
    link.download = `Quotation_${safeName}_${this.toFileDate(quotation.id)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadAllExcel(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const quotations = this.savedQuotations();
    if (!quotations.length) {
      return;
    }

    const rows: (string | number)[][] = [
      ['Date', 'Customer', 'Phone', 'Location', 'Items', 'Total (Rs.)'],
      ...quotations.map((quotation) => [
        quotation.createdAt,
        quotation.customerName,
        quotation.customerPhone || '-',
        quotation.projectLocation || '-',
        quotation.items
          .map((item) => `${item.description} (x${item.quantity} @ ${item.rate.toFixed(2)})`)
          .join('; '),
        quotation.total.toFixed(2),
      ]),
    ];

    const csvContent = rows.map((row) => row.map((cell) => this.toCsvField(cell)).join(',')).join('\r\n');
    // Prepend a UTF-8 BOM so Excel opens the file with correct encoding.
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Quotations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private toCsvField(value: string | number): string {
    const stringValue = String(value);
    // Prefix values that could be interpreted as formulas by Excel/Sheets (CSV/formula injection guard).
    const safeValue = /^[=+\-@]/.test(stringValue) ? `'${stringValue}` : stringValue;
    return `"${safeValue.replace(/"/g, '""')}"`;
  }

  private toFileDate(timestamp: number): string {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private resetForm(): void {
    this.customerName = '';
    this.customerPhone = '';
    this.projectLocation = '';
    this.items = [{ description: '', quantity: 1, rate: 0 }];
  }

  private buildCurrentSnapshot(): SavedQuotation | null {
    const hasDescription = this.items.some((item) => item.description.trim());
    if (!this.customerName.trim() || !hasDescription) {
      return null;
    }

    return {
      id: Date.now(),
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      projectLocation: this.projectLocation.trim(),
      items: this.items.map((item) => ({ ...item })),
      total: this.total,
      createdAt: new Date().toLocaleDateString(),
    };
  }

  private loadSaved(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      this.savedQuotations.set(JSON.parse(raw));
    } catch {
      this.savedQuotations.set([]);
    }
  }

  private persist(quotations: SavedQuotation[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
  }
}
