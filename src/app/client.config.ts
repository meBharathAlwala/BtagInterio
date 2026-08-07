import { InjectionToken } from '@angular/core';

/**
 * Central place for all client/business specific values (branding, contact
 * details, social links and EmailJS keys). When onboarding a new client,
 * update the values in `clientConfig` below — no other file should need to
 * change.
 */
export interface ClientConfig {
  /** Full brand/business name, e.g. "Serene Aura Wellness Spa" */
  name: string;
  /** Short name used in the navbar brand and browser tab title */
  shortName: string;
  /** Browser tab title */
  title: string;
  /** Logo path (served from the public/ folder) */
  logo: string;

  contact: {
    /** Human readable phone number, e.g. "9876543210" */
    phone: string;
    /** Phone number in international format for tel: links, e.g. "+919876543210" */
    phoneIntl: string;
    /** WhatsApp number (digits with country code, no +) for wa.me links */
    whatsappNumber: string;
    email: string;
    location: string;
  };

  social: {
    instagramUrl: string;
    youtubeUrl: string;
  };

  /** EmailJS credentials used by the contact form to send messages */
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
}

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('CLIENT_CONFIG');

export const clientConfig: ClientConfig = {
  name: 'Serene Aura Wellness Spa',
  shortName: 'Serene Aura',
  title: 'Serene Aura Wellness Spa',
  logo: '/favicon.png',

  contact: {
    phone: '9876543210',
    phoneIntl: '+919876543210',
    whatsappNumber: '919876543210',
    email: 'hello@sereneaura.com',
    location: 'Hyderabad, India',
  },

  social: {
    instagramUrl: 'https://www.instagram.com/',
    youtubeUrl: 'https://www.youtube.com/',
  },

  emailjs: {
    serviceId: 'service_6dfmmlt',
    templateId: 'template_r5l7c4k',
    publicKey: 'mWmJ7Dnh3hSJIud1_',
  },
};
