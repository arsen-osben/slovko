import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
declare let Telegram: any;

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
    setTimeout(() => {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram API loaded:', window.Telegram);
      } else {
        console.error('Telegram API is not available');
      }
    }, 2000); // Дати час на завантаження
  }

}
