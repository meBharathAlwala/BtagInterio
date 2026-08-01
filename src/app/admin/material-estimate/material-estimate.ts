import { Component, DestroyRef, EventEmitter, Inject, Output, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CLIENT_CONFIG, ClientConfig } from '../../client.config';
import { RevisedQuotationService, RevisedQuotationSnapshot } from '../revised-quotation.service';

type XlsxModule = typeof import('xlsx');
type XlsxWorkBook = import('xlsx').WorkBook;
type XlsxWorkSheet = import('xlsx').WorkSheet;

interface EstimateItem {
  room: string;
  material: string;
  thickness: string;
  brand: string;
  quantity: number;
  rate: number;
}

interface RoomEstimateEntry {
  index: number;
  item: EstimateItem;
}

interface ImportedEstimateData {
  clientName: string;
  projectLocation: string;
  items: EstimateItem[];
}

@Component({
  selector: 'app-material-estimate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-estimate.html',
  styleUrls: ['./material-estimate.css'],
})
export class MaterialEstimate {
  @Output() readonly revisedQuotationRequested = new EventEmitter<RevisedQuotationSnapshot>();

  clientName = '';
  projectLocation = '';
  items: EstimateItem[] = [this.createItem('Kitchen')];
  isUploadingEstimate = false;
  selectedEstimateFile: File | null = null;
  uploadStatusMessage = '';
  uploadStatusType: 'success' | 'error' | '' = '';
  private pendingGenerateAfterUpload = false;
  readonly materialOptions = [
    'Plywood',
    'Laminate',
    'Hardware',
    'Electrical Work',
    'False Ceiling',
    'Granite Work',
    'Carpenter Charges',
    'Modular Factory Charges',
    'Painting',
    'Wallpaper',
    'Glass Work',
    'Plumbing',
    'Other',
  ];
  readonly plywoodThicknessOptions = ['4 mm', '6 mm', '9 mm', '12 mm', '16 mm', '18 mm', '19 mm', '25 mm'];
  readonly laminateOptions = ['Inner Laminate', 'Outer Laminate'];
  readonly hardwareOptions = [
    'Hinges',
    'Drawer Channels',
    'Handles',
    'Kitchen Accessories',
    'Wardrobe Accessories',
    'Sliding Door Hardware',
    'Locks & Security',
    'Door Accessories',
    'Fasteners & Connectors',
    'Lighting Accessories',
  ];
  readonly electricalWorkOptions = [
    'Wiring',
    'Switches',
    'Sockets',
    'LED Lights',
    'Strip Lights',
    'Profile Lights',
    'Fan Point',
    'AC Point',
    'TV Point',
    'Chimney Point',
    'Refrigerator Point',
    'Washing Machine Point',
  ];

  readonly roomSuggestions = [
    'Kitchen',
    'Master Bedroom',
    'Children Bedroom',
    'Parents Bedroom',
    'Guest Bedroom',
    'Hall',
    'Crockery Unit',
    'Dining Room',
    'Study Room',
    'Pooja Room',
  ];

  private xlsxModulePromise: Promise<XlsxModule> | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private lastPublishedSnapshotKey = '';

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig,
    private readonly revisedQuotationService: RevisedQuotationService,
  ) {
    this.revisedQuotationService.snapshot$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((snapshot) => {
        const snapshotKey = this.getSnapshotKey(snapshot);
        if (snapshotKey === this.lastPublishedSnapshotKey) {
          return;
        }

        if (!snapshot.items.length && !snapshot.clientName.trim() && !snapshot.projectLocation.trim()) {
          return;
        }

        this.clientName = snapshot.clientName;
        this.projectLocation = snapshot.projectLocation;
        this.items = snapshot.items.length
          ? snapshot.items.map((item) => ({ ...item }))
          : [this.createItem('Kitchen')];
      });

    this.syncRevisedQuotation();

    if (isPlatformBrowser(this.platformId)) {
      this.preloadXlsxInBackground();
    }
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  }

  get visibleRooms(): string[] {
    const rooms = new Set<string>(['Kitchen']);

    this.items.forEach((item) => {
      const room = item.room.trim();
      if (room) {
        rooms.add(room);
      }
    });

    const suggestedRooms = this.roomSuggestions.filter((room) => rooms.has(room));
    const customRooms = Array.from(rooms).filter((room) => !this.roomSuggestions.includes(room));

    return [...suggestedRooms, ...customRooms];
  }

  private buildRevisedSnapshot(): RevisedQuotationSnapshot {
    const validItems = this.items
      .filter((item) => this.hasMeaningfulEstimateItem(item))
      .map((item) => ({ ...item }));

    return {
      clientName: this.clientName,
      projectLocation: this.projectLocation,
      items: validItems,
      total: this.total,
      updatedAt: new Date().toLocaleDateString(),
    };
  }

  syncRevisedQuotation(): void {
    const snapshot = this.buildRevisedSnapshot();
    this.lastPublishedSnapshotKey = this.getSnapshotKey(snapshot);
    this.revisedQuotationService.update(snapshot);
  }

  generateRevisedQuotation(): void {
    if (this.isUploadingEstimate) {
      // Keep button responsive during upload and complete navigation with fresh imported data.
      this.pendingGenerateAfterUpload = true;
      this.setUploadStatus('success', 'Upload in progress. Revised quotation will open once data is imported.');
      return;
    }

    const snapshot = this.buildRevisedSnapshot();
    this.syncRevisedQuotation();
    this.revisedQuotationService.openRevisedQuotationTab();
    this.revisedQuotationRequested.emit(snapshot);
  }

  addItem(room = 'Kitchen'): void {
    this.items.push(this.createItem(room));
    this.syncRevisedQuotation();
  }

  ensureRoomSection(room: string): void {
    if (!this.items.some((item) => item.room === room)) {
      this.items.push(this.createItem(room));
    }
    this.syncRevisedQuotation();
  }

  getRoomEntries(room: string): RoomEstimateEntry[] {
    return this.items
      .map((item, index) => ({ index, item }))
      .filter((entry) => entry.item.room === room);
  }

  getRoomTotal(room: string): number {
    return this.getRoomEntries(room).reduce((sum, entry) => sum + entry.item.quantity * entry.item.rate, 0);
  }

  onMaterialChange(item: EstimateItem): void {
    // Reset selection when material changes so thickness/laminate side stays valid.
    item.thickness = '';
    this.syncRevisedQuotation();
  }

  isPlywood(material: string): boolean {
    return material.trim().toLowerCase() === 'plywood';
  }

  isLaminate(material: string): boolean {
    return material.trim().toLowerCase() === 'laminate';
  }

  isHardware(material: string): boolean {
    return material.trim().toLowerCase() === 'hardware';
  }

  isElectricalWork(material: string): boolean {
    return material.trim().toLowerCase() === 'electrical work';
  }

  getThicknessPlaceholder(material: string): string {
    if (this.isPlywood(material)) {
      return 'Select thickness';
    }

    if (this.isLaminate(material)) {
      return 'Select laminate side';
    }

    if (this.isHardware(material)) {
      return 'Select hardware type';
    }

    if (this.isElectricalWork(material)) {
      return 'Select electrical work item';
    }

    return 'Not required';
  }

  removeItem(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
    }
    this.syncRevisedQuotation();
  }

  clearEstimate(): void {
    this.clientName = '';
    this.projectLocation = '';
    this.items = [this.createItem('Kitchen')];
    this.setUploadStatus('success', 'Estimate cleared. You can start a new estimate or upload an Excel file.');
    this.syncRevisedQuotation();
  }

  trackByRoom(_: number, room: string): string {
    return room;
  }

  trackByEntry(_: number, entry: RoomEstimateEntry): number {
    return entry.index;
  }

  downloadPdf(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const validItems = this.items.filter((item) => item.room.trim() || item.material.trim());
    if (!validItems.length) {
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
    doc.text('Material Estimate', 14, 38);

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
      head: [['Room', 'Material / Work', 'Thickness', 'Brand', 'Qty', 'Cost', 'Amount (Rs.)']],
      body: validItems.map((item) => [
        item.room || '-',
        item.material || '-',
        item.thickness || '-',
        item.brand || '-',
        String(item.quantity),
        item.rate.toFixed(2),
        (item.quantity * item.rate).toFixed(2),
      ]),
      foot: [['', '', '', '', '', 'Total', this.total.toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: [123, 94, 167] },
      footStyles: { fillColor: [244, 244, 244], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    const safeName = (this.clientName || 'estimate').replace(/[^a-z0-9]+/gi, '_') || 'estimate';
    const fileDate = new Date().toISOString().slice(0, 10);
    doc.save(`Material_Estimate_${safeName}_${fileDate}.pdf`);
  }

  async downloadExcel(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const validItems = this.items.filter((item) => item.room.trim() || item.material.trim());
    if (!validItems.length) {
      return;
    }

    const metadataRows: (string | number)[][] = [
      ['Field', 'Value'],
      ['Client', this.clientName],
      ['Project Location', this.projectLocation],
      ['Date', new Date().toLocaleDateString()],
      ['Total', this.total.toFixed(2)],
    ];

    const itemRows: (string | number)[][] = [
      ['Room', 'Material / Work', 'Thickness', 'Brand', 'Qty', 'Cost', 'Amount (Rs.)'],
      ...validItems.map((item) => [
        item.room,
        item.material,
        item.thickness,
        item.brand,
        item.quantity,
        item.rate,
        item.quantity * item.rate,
      ]),
    ];

    const xlsx = await this.loadXlsx();
    const workbook = xlsx.utils.book_new();
    const metadataSheet = xlsx.utils.aoa_to_sheet(metadataRows);
    const itemsSheet = xlsx.utils.aoa_to_sheet(itemRows);

    xlsx.utils.book_append_sheet(workbook, metadataSheet, 'Estimate Metadata');
    xlsx.utils.book_append_sheet(workbook, itemsSheet, 'Estimate Items');

    const safeName = (this.clientName || 'estimate').replace(/[^a-z0-9]+/gi, '_') || 'estimate';
    const fileDate = new Date().toISOString().slice(0, 10);
    xlsx.writeFile(workbook, `Material_Estimate_${safeName}_${fileDate}.xlsx`);
  }

  onEstimateFileSelected(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.selectedEstimateFile = null;
      return;
    }

    this.selectedEstimateFile = file;
    this.setUploadStatus('success', `File selected: ${file.name}. Click Submit to import.`);
  }

  async submitEstimateUpload(fileInput?: HTMLInputElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.selectedEstimateFile) {
      this.setUploadStatus('error', 'Please choose an Excel file first.');
      return;
    }

    this.clearUploadStatus();
    this.isUploadingEstimate = true;
    this.setUploadStatus('success', 'Loading Excel engine...');

    try {
      const fileBuffer = await this.selectedEstimateFile.arrayBuffer();
      this.setUploadStatus('success', 'Reading estimate workbook...');

      const xlsx = await this.loadXlsx();
      const workbook = xlsx.read(fileBuffer, { type: 'array' });
      this.setUploadStatus('success', 'Applying estimate data...');

      const imported = this.parseWorkbook(xlsx, workbook);
      if (!imported.items.length) {
        this.setUploadStatus('error', 'No estimate rows were found in the uploaded file.');
        return;
      }

      this.clientName = imported.clientName;
      this.projectLocation = imported.projectLocation;
      this.items = imported.items;
      this.setUploadStatus('success', `Estimate loaded successfully from ${this.selectedEstimateFile?.name ?? 'selected file'}.`);
      this.syncRevisedQuotation();

      if (this.pendingGenerateAfterUpload) {
        this.pendingGenerateAfterUpload = false;
        const snapshot = this.buildRevisedSnapshot();
        this.revisedQuotationService.openRevisedQuotationTab();
        this.revisedQuotationRequested.emit(snapshot);
      }
    } catch {
      this.pendingGenerateAfterUpload = false;
      this.setUploadStatus('error', 'Invalid Excel file. Please upload a file downloaded from Material Estimate.');
    } finally {
      this.isUploadingEstimate = false;
      this.selectedEstimateFile = null;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  private createItem(room: string): EstimateItem {
    return {
      room,
      material: '',
      thickness: '',
      brand: '',
      quantity: 1,
      rate: 0,
    };
  }

  private hasMeaningfulEstimateItem(item: EstimateItem): boolean {
    return Boolean(item.material.trim() || item.thickness.trim() || item.brand.trim() || item.quantity > 0 || item.rate > 0);
  }

  private clearUploadStatus(): void {
    this.uploadStatusMessage = '';
    this.uploadStatusType = '';
  }

  private setUploadStatus(type: 'success' | 'error', message: string): void {
    this.uploadStatusType = type;
    this.uploadStatusMessage = message;
  }

  private parseWorkbook(xlsx: XlsxModule, workbook: XlsxWorkBook): ImportedEstimateData {
    const metadataSheet = workbook.Sheets['Estimate Metadata'];
    const itemsSheet = workbook.Sheets['Estimate Items'];

    if (metadataSheet && itemsSheet) {
      return this.parseStructuredWorkbook(xlsx, metadataSheet, itemsSheet);
    }

    return this.parseLegacyWorksheet(xlsx, workbook.Sheets[workbook.SheetNames[0]]);
  }

  private parseStructuredWorkbook(xlsx: XlsxModule, metadataSheet: XlsxWorkSheet, itemsSheet: XlsxWorkSheet): ImportedEstimateData {
    const metadataRows = xlsx.utils.sheet_to_json<(string | number)[]>(metadataSheet, { header: 1, defval: '' });
    const itemRows = xlsx.utils.sheet_to_json<(string | number)[]>(itemsSheet, { header: 1, defval: '' });
    const metadata = new Map<string, string>();

    metadataRows.slice(1).forEach((row) => {
      const key = String(row[0] ?? '').trim();
      if (key) {
        metadata.set(key, String(row[1] ?? '').trim());
      }
    });

    return {
      clientName: metadata.get('Client') ?? '',
      projectLocation: metadata.get('Project Location') ?? '',
      items: itemRows
        .slice(1)
        .map((row) => this.rowToEstimateItem(row))
        .filter((item): item is EstimateItem => item !== null),
    };
  }

  private parseLegacyWorksheet(xlsx: XlsxModule, sheet: XlsxWorkSheet): ImportedEstimateData {
    const rows = xlsx.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, defval: '' });
    const metadata = new Map<string, string>();
    const headerIndex = rows.findIndex(
      (row) => String(row[0] ?? '').trim().toLowerCase() === 'room' && String(row[1] ?? '').trim().toLowerCase() === 'material / work',
    );

    rows.slice(0, Math.max(headerIndex, 0)).forEach((row) => {
      const key = String(row[0] ?? '').trim();
      if (key && row.length > 1) {
        metadata.set(key, String(row[1] ?? '').trim());
      }
    });

    const itemRows = headerIndex >= 0 ? rows.slice(headerIndex + 1) : [];

    return {
      clientName: metadata.get('Client') === '-' ? '' : metadata.get('Client') ?? '',
      projectLocation: metadata.get('Project Location') === '-' ? '' : metadata.get('Project Location') ?? '',
      items: itemRows
        .map((row) => this.rowToEstimateItem(row))
        .filter((item): item is EstimateItem => item !== null),
    };
  }

  private rowToEstimateItem(row: (string | number)[]): EstimateItem | null {
    const room = String(row[0] ?? '').trim();
    const material = String(row[1] ?? '').trim();
    const thickness = String(row[2] ?? '').trim();
    const brand = String(row[3] ?? '').trim();
    const quantity = this.toNumber(row[4]);
    const rate = this.toNumber(row[5]);

    const normalizedRoom = room === '-' ? '' : room;
    const normalizedMaterial = material === '-' ? '' : material;
    const normalizedThickness = thickness === '-' ? '' : thickness;
    const normalizedBrand = brand === '-' ? '' : brand;

    if (!normalizedRoom && !normalizedMaterial && quantity === 0 && rate === 0) {
      return null;
    }

    if (normalizedMaterial.toLowerCase() === 'total') {
      return null;
    }

    return {
      room: normalizedRoom || 'Kitchen',
      material: normalizedMaterial,
      thickness: normalizedThickness,
      brand: normalizedBrand,
      quantity,
      rate,
    };
  }

  private toNumber(value: string | number | undefined): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    const normalized = String(value ?? '')
      .replace(/,/g, '')
      .trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private loadXlsx(): Promise<XlsxModule> {
    if (!this.xlsxModulePromise) {
      this.xlsxModulePromise = import('xlsx');
    }

    return this.xlsxModulePromise;
  }

  private preloadXlsxInBackground(): void {
    const schedulePreload = () => {
      void this.loadXlsx();
    };

    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => schedulePreload(), { timeout: 1500 });
      return;
    }

    setTimeout(schedulePreload, 600);
  }

  private getSnapshotKey(snapshot: RevisedQuotationSnapshot): string {
    return JSON.stringify({
      clientName: snapshot.clientName,
      projectLocation: snapshot.projectLocation,
      items: snapshot.items,
      total: snapshot.total,
    });
  }
}
