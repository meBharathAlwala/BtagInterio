import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CLIENT_CONFIG, ClientConfig } from '../../client.config';

interface MeasurementRow {
  roomName: string;
  length: number | null;
  width: number | null;
  unit: string;
}

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './measurements.html',
  styleUrls: ['./measurements.css'],
})
export class Measurements {
  clientName = '';
  projectLocation = '';
  rows: MeasurementRow[] = [{ roomName: '', length: null, width: null, unit: 'feet' }];

  readonly measurementUnits = ['mm', 'cm', 'inch', 'feet'];

  readonly roomSuggestions = [
    'Kitchen',
    'Master Bedroom',
    'Bedroom',
    'Living Room',
    'Dining Room',
    'TV Unit',
    'Wardrobe',
    'Bathroom',
    'Balcony',
    'Foyer',
    'Study Room',
    'Pooja Room',
  ];

  private readonly unitToMm: Record<string, number> = {
    mm: 1,
    cm: 10,
    inch: 25.4,
    feet: 304.8,
  };

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig,
  ) {}

  addRow(): void {
    this.rows.push({ roomName: '', length: null, width: null, unit: 'feet' });
  }

  addSuggestedRow(roomName: string): void {
    const lastRow = this.rows[this.rows.length - 1];
    if (lastRow && !lastRow.roomName.trim()) {
      lastRow.roomName = roomName;
    } else {
      this.rows.push({ roomName, length: null, width: null, unit: 'feet' });
    }
  }

  removeRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);
    }
  }

  rowSqFt(row: MeasurementRow): number | null {
    if (!row.length || !row.width || isNaN(row.length) || isNaN(row.width)) {
      return null;
    }

    const mmPerFoot = this.unitToMm['feet'];
    const lengthInFeet = (row.length * this.unitToMm[row.unit]) / mmPerFoot;
    const widthInFeet = (row.width * this.unitToMm[row.unit]) / mmPerFoot;
    return lengthInFeet * widthInFeet;
  }

  get totalSqFt(): number {
    return this.rows.reduce((sum, row) => sum + (this.rowSqFt(row) ?? 0), 0);
  }

  downloadPdf(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const validRows = this.rows.filter((row) => row.roomName.trim() && this.rowSqFt(row) !== null);
    if (!validRows.length) {
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
    doc.text('Site Measurements', 14, 38);

    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 45);
    if (this.clientName.trim()) {
      doc.text(`Client: ${this.clientName.trim()}`, 14, 51);
    }
    if (this.projectLocation.trim()) {
      doc.text(`Project Location: ${this.projectLocation.trim()}`, 14, 57);
    }

    autoTable(doc, {
      startY: 64,
      head: [['Room / Area', 'Length', 'Width', 'Unit', 'Area (Sq.ft)']],
      body: validRows.map((row) => [
        row.roomName,
        String(row.length),
        String(row.width),
        row.unit,
        (this.rowSqFt(row) ?? 0).toFixed(2),
      ]),
      foot: [['', '', '', 'Total', this.totalSqFt.toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: [123, 94, 167] },
      footStyles: { fillColor: [244, 244, 244], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    const safeName = (this.clientName || 'site').replace(/[^a-z0-9]+/gi, '_') || 'site';
    const fileDate = new Date().toISOString().slice(0, 10);
    doc.save(`Measurements_${safeName}_${fileDate}.pdf`);
  }
}
