import {Component} from '@angular/core';
import { Injectable} from '@angular/core';
declare let Telegram: any;


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'slovko';

}
