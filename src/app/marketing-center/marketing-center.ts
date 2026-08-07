import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TemplateOption {
  id: string;
  name: string;
  accent: string;
  softAccent: string;
  background: string;
}

interface OccasionOption {
  id: string;
  name: string;
  category: 'general' | 'festival' | 'holiday' | 'seasonal';
  title: string;
  description: string;
  discount: string;
  cta: string;
  templateId: string;
  themeColor: string;
}

@Component({
  selector: 'app-marketing-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketing-center.html',
  styleUrls: ['./marketing-center.css'],
})
export class MarketingCenter {
  @ViewChild('posterCanvas', { static: false }) posterCanvas!: ElementRef<HTMLDivElement>;

  title = 'Luxury Wellness Escape';
  description = 'Enjoy a soothing ritual of massage, skincare, and calm rejuvenation designed just for you.';
  discount = '25';
  originalPrice = '₹180';
  offerPrice = '₹120';
  validUntil = '2026-10-31';
  phone = '+91 98765 43210';
  whatsapp = '+91 98765 43210';
  website = 'https://sereneaura.com';
  address = '42 Lotus Avenue, Wellness City';
  cta = 'Book Now';
  templateId = 'luxury';
  themeColor = '#8A659D';
  fontFamily = 'Poppins';
  logoFileName = 'Spa Logo';
  backgroundFileName = 'Background';
  logoPreview: string | null = null;
  backgroundPreview: string | null = null;
  exportFormat = 'png';
  exportTarget = 'instagram';
  activeTab: 'editor' | 'preview' = 'editor';
  occasionId = 'custom';

  templates: TemplateOption[] = [
    { id: 'luxury', name: 'Luxury', accent: '#8A659D', softAccent: '#efe2f6', background: 'linear-gradient(135deg, #fdf7ff 0%, #f1e7f8 100%)' },
    { id: 'minimal', name: 'Minimal', accent: '#6d5b8d', softAccent: '#ece7f3', background: 'linear-gradient(135deg, #ffffff 0%, #f4effa 100%)' },
    { id: 'wellness', name: 'Wellness', accent: '#5d8a6a', softAccent: '#e8f3eb', background: 'linear-gradient(135deg, #f5fbf7 0%, #e4f2e8 100%)' },
    { id: 'gold', name: 'Gold', accent: '#b6913d', softAccent: '#f8f0d6', background: 'linear-gradient(135deg, #fffdf6 0%, #f7ebc3 100%)' },
    { id: 'green', name: 'Green', accent: '#4c7a5b', softAccent: '#eaf6ed', background: 'linear-gradient(135deg, #f6fff8 0%, #e1f1e4 100%)' }
  ];

  fonts = ['Poppins', 'Cormorant Garamond', 'Lora', 'Montserrat', 'Playfair Display'];

  occasions: OccasionOption[] = [
    { id: 'custom', name: 'Custom Offer', category: 'general', title: this.title, description: this.description, discount: this.discount, cta: this.cta, templateId: this.templateId, themeColor: this.themeColor },

    // Festivals
    { id: 'new-year', name: 'New Year Special', category: 'festival', title: 'New Year, New Glow', description: 'Start the year renewed with a rejuvenating wellness ritual designed to refresh your mind and body.', discount: '20', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },
    { id: 'holi', name: 'Holi Special', category: 'festival', title: 'Holi Color Care Ritual', description: "Restore your skin's radiance after the festival of colors with a soothing detox ritual.", discount: '20', cta: 'Book Now', templateId: 'wellness', themeColor: '#5d8a6a' },
    { id: 'gudi-padwa', name: 'Ugadi / Gudi Padwa Special', category: 'festival', title: 'Ugadi New Beginnings Ritual', description: 'Welcome the new year with a fresh-start ritual for total mind-body renewal.', discount: '20', cta: 'Book Now', templateId: 'wellness', themeColor: '#5d8a6a' },
    { id: 'sankranti', name: 'Makar Sankranti / Pongal Special', category: 'festival', title: 'Sankranti Harvest Wellness', description: 'Welcome the harvest season with a rejuvenating spa treat for you and your loved ones.', discount: '20', cta: 'Limited Time Offer', templateId: 'wellness', themeColor: '#5d8a6a' },
    { id: 'eid', name: 'Eid Special', category: 'festival', title: 'Eid Mubarak Wellness Gift', description: 'Celebrate Eid with a gift of relaxation and rejuvenation for you and your loved ones.', discount: '20', cta: 'Book Now', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'easter', name: 'Easter Special', category: 'festival', title: 'Easter Renewal Retreat', description: 'Embrace renewal this Easter with a refreshing seasonal spa ritual.', discount: '15', cta: 'Book Now', templateId: 'minimal', themeColor: '#6d5b8d' },
    { id: 'raksha-bandhan', name: 'Raksha Bandhan Special', category: 'festival', title: 'Raksha Bandhan Sibling Spa Day', description: 'Celebrate the bond of siblings with a relaxing spa day designed for two.', discount: '20', cta: 'Book Now', templateId: 'wellness', themeColor: '#5d8a6a' },
    { id: 'janmashtami', name: 'Janmashtami Special', category: 'festival', title: 'Janmashtami Wellness Blessing', description: 'Celebrate the divine festival with a calming ritual to nurture your inner peace.', discount: '18', cta: 'Book Now', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi Special', category: 'festival', title: 'Ganesh Chaturthi Blessings Ritual', description: 'Invite positivity and calm into your life with a festive wellness ritual.', discount: '20', cta: 'Book Now', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'onam', name: 'Onam Special', category: 'festival', title: 'Onam Harvest Wellness Ritual', description: 'Celebrate the spirit of Onam with a traditional rejuvenation ritual crafted with care.', discount: '20', cta: 'Book Now', templateId: 'wellness', themeColor: '#5d8a6a' },
    { id: 'navratri', name: 'Navratri / Dussehra Special', category: 'festival', title: 'Navratri Radiance Ritual', description: 'Nine nights of celebration deserve nine days of glow, enjoy our special festive ritual.', discount: '25', cta: 'Limited Time Offer', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'karwa-chauth', name: 'Karwa Chauth Special', category: 'festival', title: 'Karwa Chauth Glow Ritual', description: 'Prepare for the celebration with a radiant pre-festival beauty and wellness ritual.', discount: '20', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },
    { id: 'diwali', name: 'Diwali Special', category: 'festival', title: 'Diwali Radiance Ritual', description: 'Celebrate the festival of lights with a glowing skin and wellness ritual crafted to make you shine.', discount: '30', cta: 'Book Now', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'bhai-dooj', name: 'Bhai Dooj Special', category: 'festival', title: 'Bhai Dooj Sibling Wellness Treat', description: 'Celebrate the festival of Bhai Dooj with a relaxing gift of wellness for your sibling.', discount: '18', cta: 'Book Now', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'christmas', name: 'Christmas Special', category: 'festival', title: 'Christmas Joy Wellness Package', description: 'Unwrap the gift of relaxation this Christmas with our festive wellness package.', discount: '25', cta: 'Limited Time Offer', templateId: 'green', themeColor: '#4c7a5b' },
    { id: 'new-year-eve', name: "New Year's Eve Special", category: 'festival', title: "New Year's Eve Glow Party Prep", description: 'Get glowing and ready to ring in the new year with a rejuvenating pre-party ritual.', discount: '20', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },

    // National & Global Observances
    { id: 'republic-day', name: 'Republic Day Offer', category: 'holiday', title: 'Republic Day Wellness Special', description: 'Celebrate the spirit of the nation with a patriotic pampering package just for you.', discount: '26', cta: 'Limited Time Offer', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'valentines-day', name: "Valentine's Day Special", category: 'holiday', title: "Valentine's Day Couple Retreat", description: 'Celebrate love with a romantic spa escape crafted for two.', discount: '20', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },
    { id: 'womens-day', name: "Women's Day Special", category: 'holiday', title: "Women's Day Pamper Package", description: 'A well-deserved day of pampering, because you deserve to feel celebrated and cared for.', discount: '25', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },
    { id: 'mothers-day', name: "Mother's Day Special", category: 'holiday', title: "Mother's Day Pamper Gift", description: 'Treat the most special woman in your life to a well-deserved day of relaxation.', discount: '25', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },
    { id: 'independence-day', name: 'Independence Day Special', category: 'holiday', title: 'Independence Day Freedom Offer', description: 'Celebrate freedom with a liberating wellness experience at special festive pricing.', discount: '26', cta: 'Limited Time Offer', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'friendship-day', name: 'Friendship Day Special', category: 'holiday', title: 'Friendship Day Spa Duo', description: 'Bring your best friend along for a rejuvenating spa day to remember.', discount: '20', cta: 'Book Now', templateId: 'minimal', themeColor: '#6d5b8d' },
    { id: 'childrens-day', name: "Children's Day Family Special", category: 'holiday', title: "Children's Day Family Wellness Day", description: 'A special family day of relaxation and bonding to celebrate the little ones.', discount: '15', cta: 'Book Now', templateId: 'minimal', themeColor: '#6d5b8d' },
    { id: 'anniversary', name: 'Anniversary / Wedding Special', category: 'holiday', title: 'Anniversary Romance Retreat', description: "Celebrate your special day with a romantic couple's wellness experience.", discount: '20', cta: 'Book Now', templateId: 'luxury', themeColor: '#8A659D' },

    // Seasonal & General
    { id: 'summer-special', name: 'Summer Special', category: 'seasonal', title: 'Summer Cool Down Ritual', description: 'Beat the heat with a refreshing, cooling wellness ritual designed for summer glow.', discount: '15', cta: 'Book Now', templateId: 'wellness', themeColor: '#5d8a6a' },
    { id: 'monsoon-special', name: 'Monsoon Special', category: 'seasonal', title: 'Monsoon Rejuvenation Ritual', description: 'Embrace the rains with a warm, soothing wellness ritual to lift your mood.', discount: '15', cta: 'Book Now', templateId: 'green', themeColor: '#4c7a5b' },
    { id: 'winter-special', name: 'Winter Special', category: 'seasonal', title: 'Winter Warmth Wellness Ritual', description: 'Stay cozy and glowing this winter with a nourishing seasonal spa ritual.', discount: '15', cta: 'Book Now', templateId: 'gold', themeColor: '#b6913d' },
    { id: 'weekend', name: 'Weekend Offer', category: 'seasonal', title: 'Weekend Relaxation Getaway', description: "Unwind this weekend with an exclusive spa escape designed to melt away the week's stress.", discount: '15', cta: 'Book Now', templateId: 'minimal', themeColor: '#6d5b8d' }
  ];

  occasionCategories: { id: OccasionOption['category']; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'festival', label: 'Festivals' },
    { id: 'holiday', label: 'National & Global Days' },
    { id: 'seasonal', label: 'Seasonal Offers' }
  ];

  occasionsByCategory(category: OccasionOption['category']): OccasionOption[] {
    return this.occasions.filter((occasion) => occasion.category === category);
  }

  get selectedTemplate(): TemplateOption {
    return this.templates.find((template) => template.id === this.templateId) ?? this.templates[0];
  }

  get qrValue(): string {
    return this.website || 'https://example.com';
  }

  get formattedDiscount(): string {
    return this.discount ? `-${this.discount}%` : 'Special Offer';
  }

  get previewTitle(): string {
    return this.title || 'Offer Title';
  }

  get previewDescription(): string {
    return this.description || 'A luxurious wellness offer crafted for your next visit.';
  }

  switchTab(tab: 'editor' | 'preview'): void {
    this.activeTab = tab;
  }

  applyOccasion(id: string): void {
    this.occasionId = id;
    if (id === 'custom') return;
    const occasion = this.occasions.find((item) => item.id === id);
    if (!occasion) return;
    this.title = occasion.title;
    this.description = occasion.description;
    this.discount = occasion.discount;
    this.cta = occasion.cta;
    this.templateId = occasion.templateId;
    this.themeColor = occasion.themeColor;
  }

  onLogoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.logoFileName = file.name;
    this.readFileAsDataURL(file, (result) => (this.logoPreview = result));
  }

  onBackgroundUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.backgroundFileName = file.name;
    this.readFileAsDataURL(file, (result) => (this.backgroundPreview = result));
  }

  onDrop(event: DragEvent, type: 'logo' | 'background'): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    if (type === 'logo') {
      this.logoFileName = file.name;
      this.readFileAsDataURL(file, (result) => (this.logoPreview = result));
    } else {
      this.backgroundFileName = file.name;
      this.readFileAsDataURL(file, (result) => (this.backgroundPreview = result));
    }
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  private readFileAsDataURL(file: File, callback: (result: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  async downloadPoster(format: 'png' | 'jpg' | 'pdf'): Promise<void> {
    const element = this.posterCanvas?.nativeElement;
    if (!element) return;

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    if (format === 'pdf') {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.title || 'marketing'}-flyer.pdf`);
      return;
    }

    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const link = document.createElement('a');
    link.download = `${this.title || 'marketing'}-${format}.${format}`;
    link.href = format === 'jpg' ? canvas.toDataURL(mimeType, 0.95) : canvas.toDataURL(mimeType);
    link.click();
  }

  printPoster(): void {
    window.print();
  }
}
