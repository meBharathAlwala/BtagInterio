import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CLIENT_CONFIG, ClientConfig } from '../client.config';

const STORAGE_KEY = 'btag_admin_authenticated';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(CLIENT_CONFIG) private readonly clientConfig: ClientConfig,
  ) {}

  login(username: string, password: string): boolean {
    const { username: validUsername, password: validPassword } = this.clientConfig.admin;
    const isValid = username === validUsername && password === validPassword;

    if (isValid && isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }

    return isValid;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  }
}
