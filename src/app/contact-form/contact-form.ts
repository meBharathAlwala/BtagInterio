import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

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

  onSubmit(form: HTMLFormElement) {
    this.sending.set(true);
    this.status.set('idle');

    emailjs.sendForm('service_6dfmmlt', 'template_r5l7c4k', form, 'mWmJ7Dnh3hSJIud1_')
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
