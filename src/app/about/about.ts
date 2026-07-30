import { Component, Inject } from '@angular/core';
import { CLIENT_CONFIG, ClientConfig } from '../client.config';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About {
  constructor(@Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig) {}
}
