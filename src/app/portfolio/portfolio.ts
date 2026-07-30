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
  // Images placed in the project's public/ folder
  images = [
    { src: '/tv.jpg', title: 'TV Unit', description: 'Custom TV unit with floating shelves and concealed wiring.' },
    { src: '/pbr.jpg', title: 'PBR Project', description: 'Elegant living room makeover featuring warm wood tones.' },
    { src: '/kitchen.jpg', title: 'Kitchen', description: 'Modern modular kitchen with matte finishes and ample storage.' },
    { src: '/kitchen2.jpg', title: 'Vanity', description: 'Open-plan kitchen with island and contemporary cabinetry.' },
    { src: '/ceiling.jpg', title: 'Ceiling', description: 'Decorative false ceiling with layered lighting.' },
    { src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', title: 'Living Room', description: 'Spacious living room with contemporary furniture and natural light.' },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', title: 'Cozy Interior', description: 'Warm, minimalist living space with soft textures and ambient lighting.' },
    { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80', title: 'Bedroom', description: 'Serene bedroom design with wooden accents and soft neutral tones.' },
    { src: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80', title: 'Bedroom', description: 'Sleek wardrobe design with integrated lighting and mirror finish.' },
    { src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80', title: 'Living space', description: 'Elegant dining area with statement lighting and premium finishes.' },
    { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', title: 'BedRoom', description: 'Contemporary kitchen design with sleek cabinetry and premium fittings.' },
  ];
}
