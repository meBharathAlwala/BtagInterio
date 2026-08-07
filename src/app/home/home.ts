import { Component, Inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactForm } from '../contact-form/contact-form';
import { CLIENT_CONFIG, ClientConfig } from '../client.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, ContactForm],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  featured = [
    { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80', title: 'Aromatherapy Escape' },
    { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80', title: 'Skin Glow Facial' },
    { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80', title: 'Deep Tissue Relief' },
  ];

  constructor(@Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig) {}
}
