import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private games: number = 0;
  private wins: number = 0;
  private winStreak: number = 0;
  private longestWinStreak: number = 0;

  constructor() {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    const stats = localStorage.getItem('gameStatistics');
    if (stats) {
      try {
        const parsedStats = JSON.parse(stats);
        this.games = parsedStats.games || 0;
        this.wins = parsedStats.wins || 0;
        this.winStreak = parsedStats.winStreak || 0;
        this.longestWinStreak = parsedStats.longestWinStreak || 0;
      } catch (e) {
        console.error('Помилка завантаження статистики:', e);
      }
    }
  }

  private saveStatistics(): void {
    const stats = {
      games: this.games,
      wins: this.wins,
      winStreak: this.winStreak,
      longestWinStreak: this.longestWinStreak
    };
    localStorage.setItem('gameStatistics', JSON.stringify(stats));
  }

  updateStatistics(isWin: boolean): void {
    this.games++;

    if (isWin) {
      this.wins++;
      this.winStreak++;
      if (this.winStreak > this.longestWinStreak) {
        this.longestWinStreak = this.winStreak;
      }
    } else {
      this.winStreak = 0;
    }

    this.saveStatistics();
  }

  getStatistics() {
    return {
      games: this.games,
      wins: this.wins,
      winStreak: this.winStreak,
      longestWinStreak: this.longestWinStreak
    };
  }
}
