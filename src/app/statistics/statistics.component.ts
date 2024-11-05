// src/app/statistics/statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  email: string | null = null;
  games: number | null = null;
  wins: number | null = null;
  errorMessage: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      const profile = await this.supabaseService.getProfile();

      if (profile) {
        this.email = profile.email;
        this.games = profile.games;
        this.wins = profile.wins;
      }
    } catch (error) {
      this.errorMessage = 'Не вдалося завантажити дані профілю.';
      console.error(error);
    }
  }
}
