import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'slovko';
  ngOnInit() {
    if ((window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.expand(); // Розширює гру на весь екран
    }
  }
}
