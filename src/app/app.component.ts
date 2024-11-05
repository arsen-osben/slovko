import { Component, HostListener } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { Injectable } from '@angular/core';

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
  constructor(public supabaseService: SupabaseService) {}

  logout() {
    this.supabaseService.signOut();
  }

}
