import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import jsPDF from 'jspdf';
import { RevisedQuotationSnapshot } from '../revised-quotation.service';

interface ChartRow {
  label: string;
  total: number;
  width: number;
}

@Component({
  selector: 'app-estimate-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estimate-charts.html',
  styleUrls: ['./estimate-charts.css'],
})
export class EstimateCharts {
  @Input() snapshot: RevisedQuotationSnapshot = {
    clientName: '',
    projectLocation: '',
    items: [],
    total: 0,
    updatedAt: '',
  };

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  get sectionRows(): ChartRow[] {
    return this.buildRows((item) => item.room?.trim() || 'General');
  }

  get materialRows(): ChartRow[] {
    return this.buildRows((item) => item.material?.trim() || 'Other');
  }

  downloadCharts(): void {
    if (!isPlatformBrowser(this.platformId) || !this.snapshot.items.length) {
      return;
    }

    const doc = new jsPDF();
    let cursorY = 20;

    doc.setFontSize(18);
    doc.text('Estimate Charts', 14, cursorY);
    cursorY += 8;

    doc.setFontSize(10);
    doc.text(`Date: ${this.snapshot.updatedAt || new Date().toLocaleDateString()}`, 14, cursorY);
    cursorY += 6;

    if (this.snapshot.clientName.trim()) {
      doc.text(`Client: ${this.snapshot.clientName.trim()}`, 14, cursorY);
      cursorY += 6;
    }

    if (this.snapshot.projectLocation.trim()) {
      doc.text(`Project Location: ${this.snapshot.projectLocation.trim()}`, 14, cursorY);
      cursorY += 6;
    }

    doc.text(`Total: Rs. ${this.snapshot.total.toFixed(2)}`, 14, cursorY);
    cursorY += 10;

    cursorY = this.drawChart(doc, 'Section Wise Chart', this.sectionRows, cursorY, [123, 94, 167]);
    cursorY += 8;
    this.drawChart(doc, 'Material Wise Chart', this.materialRows, cursorY, [217, 135, 47]);

    const safeName = (this.snapshot.clientName || 'estimate_charts').replace(/[^a-z0-9]+/gi, '_') || 'estimate_charts';
    const fileDate = new Date().toISOString().slice(0, 10);
    doc.save(`Estimate_Charts_${safeName}_${fileDate}.pdf`);
  }

  private buildRows(labelResolver: (item: RevisedQuotationSnapshot['items'][number]) => string): ChartRow[] {
    const totals = new Map<string, number>();

    for (const item of this.snapshot.items) {
      const label = labelResolver(item);
      const amount = item.quantity * item.rate;
      totals.set(label, (totals.get(label) ?? 0) + amount);
    }

    const rows = Array.from(totals.entries())
      .map(([label, total]) => ({ label, total }))
      .filter((row) => row.total > 0)
      .sort((left, right) => right.total - left.total);

    const maxValue = rows[0]?.total ?? 0;

    return rows.map((row) => ({
      ...row,
      width: maxValue > 0 ? (row.total / maxValue) * 100 : 0,
    }));
  }

  private drawChart(doc: jsPDF, title: string, rows: ChartRow[], startY: number, color: [number, number, number]): number {
    let cursorY = startY;

    doc.setFontSize(13);
    doc.text(title, 14, cursorY);
    cursorY += 8;

    if (!rows.length) {
      doc.setFontSize(10);
      doc.text('No data available.', 14, cursorY);
      return cursorY + 8;
    }

    rows.forEach((row) => {
      if (cursorY > 270) {
        doc.addPage();
        cursorY = 20;
      }

      doc.setFontSize(10);
      doc.text(row.label, 14, cursorY);
      doc.text(`Rs. ${row.total.toFixed(2)}`, 190, cursorY, { align: 'right' });
      cursorY += 3;

      doc.setDrawColor(241, 235, 248);
      doc.setFillColor(241, 235, 248);
      doc.roundedRect(14, cursorY, 176, 6, 2, 2, 'F');
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(14, cursorY, Math.max((176 * row.width) / 100, 2), 6, 2, 2, 'F');
      cursorY += 11;
    });

    return cursorY;
  }
}