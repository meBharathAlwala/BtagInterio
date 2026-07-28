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
    { src: '/kitchen2.jpg', title: 'Kitchen 2', description: 'Open-plan kitchen with island and contemporary cabinetry.' },
    { src: '/ceiling.jpg', title: 'Ceiling', description: 'Decorative false ceiling with layered lighting.' },
  ];
}
