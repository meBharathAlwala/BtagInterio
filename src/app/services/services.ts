import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceCategory {
  name: string;
  description: string;
  types: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class Services {
  categories: ServiceCategory[] = [
    {
      name: 'Modular Kitchen',
      description: 'We design 3 types of modular kitchens, each tailored to your space and cooking style with durable materials and smart storage.',
      types: ['Straight Kitchen', 'L-Shaped Kitchen', 'Island Kitchen'],
    },
    {
      name: 'Wardrobes',
      description: 'We craft 3 types of wardrobes for maximum storage and a clutter-free bedroom with elegant finishes.',
      types: ['Sliding Door Wardrobe', 'Hinged Door Wardrobe', 'Walk-in Wardrobe'],
    },
    {
      name: 'TV Units',
      description: 'We build 3 types of TV units that blend style with everyday functionality for any living space.',
      types: ['Wall-Mounted TV Unit', 'Floor-Standing TV Unit', 'Floating Panel TV Unit'],
    },
  ];
}
