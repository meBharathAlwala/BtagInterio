import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CLIENT_CONFIG, ClientConfig } from './client.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  constructor(
    @Inject(CLIENT_CONFIG) protected readonly clientConfig: ClientConfig,
    private readonly titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.clientConfig.title);
  }
}
