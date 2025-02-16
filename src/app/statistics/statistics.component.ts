import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  games: number = 0;
  wins: number = 0;
  winStreak: number = 0;
  longestWinStreak: number = 0;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    const stats = this.statisticsService.getStatistics();
    this.games = stats.games;
    this.wins = stats.wins;
    this.winStreak = stats.winStreak;
    this.longestWinStreak = stats.longestWinStreak;
  }
}
