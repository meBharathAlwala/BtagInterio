import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { CLIENT_CONFIG, ClientConfig } from '../client.config';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.css'],
})
export class ContactForm {
  sending = signal(false);
  status = signal<'idle' | 'success' | 'error'>('idle');

  constructor(@Inject(CLIENT_CONFIG) private readonly clientConfig: ClientConfig) {}

  onSubmit(form: HTMLFormElement) {
    this.sending.set(true);
    this.status.set('idle');

    const { serviceId, templateId, publicKey } = this.clientConfig.emailjs;

    emailjs.sendForm(serviceId, templateId, form, publicKey)
      .then(() => {
        this.sending.set(false);
        this.status.set('success');
        form.reset();
      })
      .catch(() => {
        this.sending.set(false);
        this.status.set('error');
      });
  }
}
