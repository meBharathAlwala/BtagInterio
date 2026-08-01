import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CLIENT_CONFIG, ClientConfig } from '../../client.config';
import { RevisedQuotationSnapshot } from '../revised-quotation.service';

@Component({
  selector: 'app-revised-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revised-quotation.html',
  styleUrls: ['./revised-quotation.css'],
})
export class RevisedQuotation {
  @Input() snapshot: RevisedQuotationSnapshot = {
    clientName: '',
    projectLocation: '',
    items: [],
    total: 0,
    updatedAt: '',
  };

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig,
  ) {}

  get summaryRows(): Array<[string, string]> {
    const totalsByRoom = new Map<string, { label: string; total: number }>();

    for (const item of this.snapshot.items) {
      const roomLabel = item.room?.trim() || 'General';
      const roomKey = roomLabel.toLowerCase();
      const amount = item.quantity * item.rate;
      const existing = totalsByRoom.get(roomKey);

      if (existing) {
        existing.total += amount;
      } else {
        totalsByRoom.set(roomKey, { label: roomLabel, total: amount });
      }
    }

    return Array.from(totalsByRoom.values())
      .filter((entry) => entry.total > 0)
      .map((entry) => [entry.label, entry.total.toFixed(2)]);
  }

  downloadPdf(): void {
    if (!isPlatformBrowser(this.platformId) || !this.snapshot.items.length) {
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
    doc.text('Revised Quotation', 14, 38);
    doc.setFontSize(10);
    doc.text(`Date: ${this.snapshot.updatedAt || new Date().toLocaleDateString()}`, 14, 45);
    if (this.snapshot.clientName.trim()) {
      doc.text(`Client: ${this.snapshot.clientName.trim()}`, 14, 51);
    }
    if (this.snapshot.projectLocation.trim()) {
      doc.text(`Project Location: ${this.snapshot.projectLocation.trim()}`, 14, 57);
    }

    autoTable(doc, {
      startY: 64,
      head: [['Description', 'Amount (Rs.)']],
      body: this.summaryRows,
      foot: [['Final Total', this.snapshot.total.toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: [123, 94, 167] },
      footStyles: { fillColor: [244, 244, 244], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    const safeName = (this.snapshot.clientName || 'revised_quotation').replace(/[^a-z0-9]+/gi, '_') || 'revised_quotation';
    const fileDate = new Date().toISOString().slice(0, 10);
    doc.save(`Revised_Quotation_${safeName}_${fileDate}.pdf`);
  }
}
