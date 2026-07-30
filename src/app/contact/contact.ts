import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactForm } from '../contact-form/contact-form';
import { CLIENT_CONFIG, ClientConfig } from '../client.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactForm],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact {
  constructor(@Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig) {}
}
