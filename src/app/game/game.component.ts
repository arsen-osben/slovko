import {Component, HostListener, OnInit} from '@angular/core';
import {SupabaseService} from "../services/supabase.service";
import {HttpClient} from "@angular/common/http";

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

  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.http.get<any>('assets/only-words-5.json').subscribe(data => {
      this.wordsArray = data['Лист1'].map((item: any) => item.word_binary);
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

      if (this.currentLetterIndex === 5) {
        this.checkWord();
      }
    }

    else if (event.key === 'Backspace' && this.currentLetterIndex > 0) {
      this.currentLetterIndex--;
      this.gameGrid[this.currentAttempt][this.currentLetterIndex] = '';
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
    }


    if (currentWord === this.secretWord) {
      this.rowStatus[this.currentAttempt] = 'win';
      this.isWin = true;
      this.gameOver = true;
      if (this.supabaseService.isLoggedIn()) {
      this.saveGameStats(true);
      }

    } else {
      this.currentAttempt++;
      this.currentLetterIndex = 0;

      if (this.currentAttempt >= this.maxAttempts) {
        this.gameOver = true;
        this.rowStatus[this.currentAttempt] = 'lose';
        if (this.supabaseService.isLoggedIn()) {
          this.saveGameStats(false);
        }
      }
    }
  }

  getLetterClass(rowIndex: number, cellIndex: number): string {
    return this.letterStatus[rowIndex][cellIndex];
  }


  async saveGameStats(won: boolean) {
    const user = await this.supabaseService.getUser();
    if (user) {
      await this.supabaseService.saveGameStats(won);
    }
  }


}
