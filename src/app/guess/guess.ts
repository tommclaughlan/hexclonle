import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-guess',
  imports: [],
  templateUrl: './guess.html',
  styleUrl: './guess.css',
})
export class Guess {

  public value = input<string[]>([]);
  public distance = input<number[]>([]);

  public color = computed<string>(() => {
    return this.value().length === 0 ? '#ffffff' : `#${this.value().join('')}`;
  });

  public getDistanceIndicator(index: number) {
    const distance = this.distance()[index];

    if (distance === 0) {
      return '✅';
    }

    if (distance > 0) {
      if (distance < 3) return '🔼';
      return '⏫';
    }
    else {
      if (distance > -3) return '🔽';
      return '⏬';
    }
  }
}
