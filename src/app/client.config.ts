import { InjectionToken } from '@angular/core';

/**
 * Central place for all client/business specific values (branding, contact
 * details, social links and EmailJS keys). When onboarding a new client,
 * update the values in `clientConfig` below — no other file should need to
 * change.
 */
export interface ClientConfig {
  /** Full brand/business name, e.g. "Btag Interio" */
  name: string;
  /** Short name used in the navbar brand and browser tab title */
  shortName: string;
  /** Browser tab title */
  title: string;
  /** Logo path (served from the public/ folder) */
  logo: string;

  contact: {
    /** Human readable phone number, e.g. "6303800938" */
    phone: string;
    /** Phone number in international format for tel: links, e.g. "+916303800938" */
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

  /** Credentials used to access the admin area (/admin/login) */
  admin: {
    username: string;
    password: string;
  };
}

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('CLIENT_CONFIG');

export const clientConfig: ClientConfig = {
  name: 'Btag Interio',
  shortName: 'Btag',
  title: 'Btag',
  logo: '/btag_logo.png',

  contact: {
    phone: '6303800938',
    phoneIntl: '+916303800938',
    whatsappNumber: '916303800938',
    email: 'btag.interio@gmail.com',
    location: 'Hyderabad',
  },

  social: {
    instagramUrl: 'https://www.instagram.com/btaginterio/',
    youtubeUrl: 'https://www.youtube.com/@BtagInterio',
  },

  emailjs: {
    serviceId: 'service_6dfmmlt',
    templateId: 'template_r5l7c4k',
    publicKey: 'mWmJ7Dnh3hSJIud1_',
  },

  admin: {
    username: 'btag',
    password: 'btag@321',
  },
};
