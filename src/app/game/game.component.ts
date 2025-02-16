import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StatisticsComponent} from "../statistics/statistics.component";
import { StatisticsService } from '../statistics/statistics.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  wordsArray: string[] = [];

  secretWord: string = '';
  maxAttempts: number = 6;
  currentAttempt: number = 0;
  currentLetterIndex: number = 0;
  gameGrid: string[][] = Array(this.maxAttempts).fill(null).map(() => Array(5).fill(''));
  rowStatus: string[] = Array(this.maxAttempts).fill('');
  gameOver: boolean = false;
  isWin: boolean = false;
  letterStatus: string[][] = Array(this.maxAttempts).fill(null).map(() => Array(5).fill(''));

  constructor(private http: HttpClient, private statisticsService: StatisticsService) {
  }

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.http.get<any>('assets/w5.json').subscribe(data => {
      this.wordsArray = data.map((item: any) => item.word_binary);
      this.startNewGame();
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver || this.currentAttempt >= this.maxAttempts) return;

    const letter = event.key.toLowerCase();
    const allowedLetters = /^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]$/;


    if (allowedLetters.test(letter) && this.currentLetterIndex < 5) {
      this.gameGrid[this.currentAttempt][this.currentLetterIndex] = letter;
      this.currentLetterIndex++;
    }
    else if (event.key === 'Backspace' && this.currentLetterIndex > 0) {
      this.currentLetterIndex--;
      this.gameGrid[this.currentAttempt][this.currentLetterIndex] = '';
    }
    else if (event.key === 'Enter') {
      if (this.currentLetterIndex === 5) {
        this.checkWord();
      } else {
        console.warn('Введіть 5 літер перед перевіркою.');
      }
    }
  }


  private getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * this.wordsArray.length);
    return this.wordsArray[randomIndex];
  }

  startNewGame(): void {
    this.secretWord = this.getRandomWord();
    console.log(this.secretWord)
    this.currentAttempt = 0;
    this.currentLetterIndex = 0;
    this.gameGrid = Array(this.maxAttempts).fill(null).map(() => Array(5).fill(''));
    this.rowStatus = Array(this.maxAttempts).fill('');
    this.letterStatus = Array(this.maxAttempts).fill(null).map(() => Array(5).fill(''));
    this.gameOver = false;
    this.isWin = false;
  }

  checkWord() {
    const currentWord = this.gameGrid[this.currentAttempt].join('');
    this.letterStatus[this.currentAttempt] = Array(5).fill('');

    for (let i = 0; i < 5; i++) {
      const guessedLetter = currentWord[i];
      const correctLetter = this.secretWord[i];

      if (guessedLetter === correctLetter) {
        this.letterStatus[this.currentAttempt][i] = 'current-letter';
      } else if (this.secretWord.includes(guessedLetter)) {
        this.letterStatus[this.currentAttempt][i] = 'is-letter';
      }
      else {
        this.letterStatus[this.currentAttempt][i] = 'no-letter';
      }
    }

    if (currentWord === this.secretWord) {
      this.rowStatus[this.currentAttempt] = 'win';
      this.isWin = true;
      this.gameOver = true;
      this.statisticsService.updateStatistics(this.isWin);

    } else {
      this.currentAttempt++;
      this.currentLetterIndex = 0;

      if (this.currentAttempt >= this.maxAttempts) {
        this.isWin = false;
        this.gameOver = true;
        this.rowStatus[this.currentAttempt] = 'lose';
        this.statisticsService.updateStatistics(this.isWin);
      }
    }
  }

  getLetterClass(rowIndex: number, cellIndex: number): string {
    return this.letterStatus[rowIndex][cellIndex];
  }


}
