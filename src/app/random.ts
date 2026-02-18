import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Random {
  private startDay: number = new Date(2026, 0, 1).getTime();

  public getRng(seed: number) {
    return () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  public daysSinceStart() {
    const end = new Date(Date.now()).setHours(0, 0, 0, 0);
    return Math.round((end - this.startDay) / (1000 * 60 * 60 * 24))
  }
}
