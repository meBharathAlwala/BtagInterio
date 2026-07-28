import { Component, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CLIENT_CONFIG, ClientConfig } from './client.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(@Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig) {}
}
