import {ApplicationRef, ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {Random} from '../random';
import {form, FormField, required} from '@angular/forms/signals';
import {Guess} from '../guess/guess';
import {HexDigit} from '../hex-digit';

interface GuessModel {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
}

interface GuessResult {
  value: string[];
  distance: number[];
}

@Component({
  selector: 'app-game',
  imports: [FormField, Guess, HexDigit],
  templateUrl: './game.html',
  styleUrl: './game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Game {
  private random: Random = inject(Random);
  private readonly MAX_GUESSES = 5;

  public win = signal<boolean>(false);
  public guesses = signal<GuessResult[]>([]);
  public showResult = signal<boolean>(false);
  public id = input<number>();
  public gameSeed = computed<number>(() => {
    const id = this.id() ?? this.random.daysSinceStart();
    return id > this.random.daysSinceStart() ? this.random.daysSinceStart() : id;
  });
  public hexCode = computed<string>(() => {
    const rng = this.random.getRng(this.gameSeed());
    return rng().toString(16).slice(2, 8).toUpperCase();
  });
  public guessList = computed<GuessResult[]>(() => {
    const guesses = [...this.guesses()];
    while (guesses.length < this.MAX_GUESSES) {
      guesses.push({ value: [], distance: []});
    }
    return guesses;
  });

  public guessModel = signal<GuessModel>({
    first: '',
    second: '',
    third: '',
    fourth: '',
    fifth: '',
    sixth: '',
  });

  public guessForm = form(this.guessModel, (guess) => {
    required(guess.first);
    required(guess.second);
    required(guess.third);
    required(guess.fourth);
    required(guess.fifth);
    required(guess.sixth);
  });

  public submit() {
    if (!this.guessForm().valid()) {
      return;
    }

    const guess = this.getGuess();
    const target = this.hexCode().split('');
    const distance: number[] = [];

    for (let i=0; i < 6; i++) {
      let diff = parseInt(target[i], 16) - parseInt(guess[i], 16);
      distance.push(diff);
    }

    const guesses = this.guesses();
    guesses.push({ value: guess, distance: distance });
    this.guesses.set(guesses);

    if (guess.join('') === target.join('')) {
      this.win = true;
      console.log('win');
    }

    if (!this.win && this.guesses().length === this.MAX_GUESSES) {
      this.win = false;
      console.log('lose');
    }

    this.resetForm();
  }

  public keyup(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      let prev = (event.target as HTMLInputElement | null)?.previousElementSibling;
      if (prev !== null) {
        (prev as HTMLInputElement).focus();
      }
    }

    if (event.key === 'Enter') {
      this.submit();

      let prev = (event.target as HTMLInputElement | null)?.previousElementSibling;
      while (prev !== null) {
        (prev as HTMLInputElement).focus();
        prev = prev?.previousElementSibling;
      }
    }
  }

  private getGuess() {
    return [
      this.guessModel().first,
      this.guessModel().second,
      this.guessModel().third,
      this.guessModel().fourth,
      this.guessModel().fifth,
      this.guessModel().sixth
    ];
  }

  private resetForm() {
    this.guessModel.set({
      first: '',
      second: '',
      third: '',
      fourth: '',
      fifth: '',
      sixth: '',
    });
  }

}
