import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [NgFor],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
})
export class Portfolio {
  images = [
    { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80', title: 'Aromatherapy Lounge', description: 'A calming room with soft lighting, natural textures, and a deeply restorative atmosphere.' },
    { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80', title: 'Massage Suite', description: 'A serene treatment room designed for privacy, comfort, and complete relaxation.' },
    { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', title: 'Relaxation Space', description: 'An inviting retreat with plush seating, warm tones, and peaceful ambiance.' },
    { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80', title: 'Facial Studio', description: 'A beautifully curated skincare treatment space focused on glow and comfort.' },
    { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80', title: 'Wellness Ritual', description: 'A signature experience blending soothing scents, gentle care, and mindful restoration.' },
    { src: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80', title: 'Steam & Sauna', description: 'A tranquil wellness area designed for detox, warmth, and pure calm.' },
  ];
}
