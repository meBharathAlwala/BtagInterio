import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactForm } from '../contact-form/contact-form';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactForm],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact {}
