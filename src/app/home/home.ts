import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactForm } from '../contact-form/contact-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, ContactForm],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  featured = [
    { src: '/tv.jpg', title: 'TV Unit' },
    { src: '/kitchen.jpg', title: 'Modular Kitchen' },
    { src: '/ceiling.jpg', title: 'False Ceiling' },
  ];
}
