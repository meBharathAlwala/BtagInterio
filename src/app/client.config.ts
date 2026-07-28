import { InjectionToken } from '@angular/core';

export interface ClientConfig {
  name: string;
}

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('CLIENT_CONFIG');

export const clientConfig: ClientConfig = {
  name: 'Btag Interio',
};
