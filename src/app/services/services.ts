import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceCategory {
  name: string;
  description: string;
  image: string;
  benefits: string[];
  subTreatments: Array<{
    name: string;
    description: string;
    image: string;
    benefits: string[];
  }>;
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
      name: 'Massage Therapy',
      description: 'Choose from deeply calming massage options that ease tension, improve circulation, and leave you feeling light and restored.',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
      benefits: ['Relieves stress', 'Improves circulation', 'Eases muscle tension'],
      subTreatments: [
        {
          name: 'Swedish Massage',
          description: 'A gentle full-body massage that promotes relaxation and improved circulation.',
          image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Calms the nervous system', 'Improves blood flow', 'Reduces tension'],
        },
        {
          name: 'Deep Tissue Massage',
          description: 'A focused massage that targets deep muscle knots and built-up tension.',
          image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Supports muscle recovery', 'Eases stiffness', 'Improves mobility'],
        },
        {
          name: 'Hot Stone Therapy',
          description: 'Warm stones are used to soothe muscles and increase comfort during your session.',
          image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Relieves deep tension', 'Encourages relaxation', 'Boosts comfort'],
        },
      ],
    },
    {
      name: 'Facial & Skin Care',
      description: 'Replenish your glow with skincare rituals that hydrate, tone, and revitalize your appearance.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
      benefits: ['Boosts hydration', 'Enhances skin glow', 'Supports skin renewal'],
      subTreatments: [
        {
          name: 'Glow Facial',
          description: 'A refreshing facial that brightens and nourishes the skin for a radiant finish.',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Hydrates deeply', 'Brightens complexion', 'Leaves skin smooth'],
        },
        {
          name: 'Acne Care',
          description: 'A calming treatment designed to balance the skin and support a clearer complexion.',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Helps control breakouts', 'Soothes irritation', 'Supports clearer skin'],
        },
        {
          name: 'Anti-Aging Facial',
          description: 'A restorative facial focused on firming, plumping, and revitalizing tired skin.',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Improves elasticity', 'Reduces fine lines', 'Boosts suppleness'],
        },
      ],
    },
    {
      name: 'Wellness Rituals',
      description: 'Enjoy complete-body relaxation with treatments that restore balance, comfort, and inner calm.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
      benefits: ['Detoxifies the body', 'Promotes deep relaxation', 'Improves overall wellbeing'],
      subTreatments: [
        {
          name: 'Body Scrub',
          description: 'A gentle exfoliation ritual that leaves the skin soft, smooth, and refreshed.',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Exfoliates skin', 'Boosts circulation', 'Leaves you refreshed'],
        },
        {
          name: 'Sauna & Steam',
          description: 'A warm wellness ritual that helps relax muscles and promote a sense of calm.',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Promotes sweating and detox', 'Relaxes muscles', 'Eases stress'],
        },
        {
          name: 'Detox Wrap',
          description: 'A comforting wrap that helps you feel lighter, calmer, and more re-energized.',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
          benefits: ['Supports detox', 'Improves comfort', 'Boosts calmness'],
        },
      ],
    },
  ];
}
