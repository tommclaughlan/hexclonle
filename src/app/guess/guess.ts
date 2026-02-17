import {Component, computed, inject, input} from '@angular/core';
import {GuessService} from "../guess-service";

@Component({
  selector: 'app-guess',
  imports: [],
  templateUrl: './guess.html',
  styleUrl: './guess.css',
})
export class Guess {
  private guessService = inject(GuessService);
  public value = input<string[]>([]);
  public distance = input<number[]>([]);

  public color = computed<string>(() => {
    return this.value().length === 0 ? '#ffffff' : `#${this.value().join('')}`;
  });

  public getDistanceIndicator(index: number) {
    const distance = this.distance()[index];
    return this.guessService.getDistanceIndicator(distance);
  }
}
