import {
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Input,
    input,
    signal
} from '@angular/core';
import {Random} from '../random';
import {form, FormField, required} from '@angular/forms/signals';
import {Guess} from '../guess/guess';
import {HexDigit} from '../hex-digit';
import {ResultModal} from "../result-modal/result-modal";

interface GuessModel {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
}

export interface GuessResult {
  value: string[];
  distance: number[];
}

@Component({
  selector: 'app-game',
  imports: [FormField, Guess, HexDigit, ResultModal],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  private random: Random = inject(Random);
  private readonly MAX_GUESSES = 5;

  public win = signal(false);
  public gameFinished = signal(false);
  public guesses = signal<GuessResult[]>([]);
  public guessesReverse = computed(() => {
    return [...this.guesses()].reverse();
  });
  public showResult = signal(false);
  // public id = input<number>();

  @Input()
  set id(id: number) {
      this.random.setSeed(id);
  }

  public gameSeed = computed<number>(() => {
    return this.random.getSeed();
    // const id = this.id() ?? this.random.daysSinceStart();
    // return id > this.random.daysSinceStart() ? this.random.daysSinceStart() : id;
  });
  public hexCode = computed<string>(() => {
    const rng = this.random.getRng(this.gameSeed());
    return rng().toString(16).slice(2, 8).toUpperCase();
  });
  public lastGuessHex = computed<string>(() => {
    if (this.guesses().length === 0) {
      return 'transparent';
    }
    return '#' + this.guesses()[this.guesses().length - 1].value.join('');
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
    if (!this.guessForm().valid() || this.guesses().length === this.MAX_GUESSES) {
      return;
    }

    const guess = this.getGuess();
    const target = this.hexCode().split('');
    const distance: number[] = [];

    for (let i=0; i < 6; i++) {
      let diff = parseInt(target[i], 16) - parseInt(guess[i], 16);
      distance.push(diff);
    }

    const guesses = [...this.guesses()];
    guesses.push({ value: guess, distance: distance });
    this.guesses.set(guesses);

    if (guess.join('') === target.join('')) {
      this.win.set(true);
      this.showResult.set(true);
      this.gameFinished.set(true);
    }

    if (!this.win() && this.guesses().length === this.MAX_GUESSES) {
      this.win.set(false);
      this.showResult.set(true);
      this.gameFinished.set(true);
    }

    this.resetForm();
  }

  public closeModal() {
    this.showResult.set(false);
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
