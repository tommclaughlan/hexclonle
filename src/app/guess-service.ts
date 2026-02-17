import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GuessService {
  public getDistanceIndicator(distance: number) {
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
