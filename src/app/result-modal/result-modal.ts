import {Component, computed, inject, input, output, signal} from '@angular/core';
import {GuessResult} from "../game/game";
import {GuessService} from "../guess-service";
import {GetColorName} from "hex-color-to-color-name";

@Component({
  selector: 'app-result-modal',
  imports: [],
  templateUrl: './result-modal.html',
  styleUrl: './result-modal.css',
})
export class ResultModal {
  private guessService = inject(GuessService);

  public win = input<boolean>(false);
  public guesses = input<GuessResult[]>([]);
  public target = input<string>('');
  public gameId = input<number>(0);
  public copied = signal(false);
  public close = output();

  public getDistanceIndicator = this.guessService.getDistanceIndicator;

  public getScore = computed(()=> {
    let red = parseInt(this.target().slice(0, 2), 16);
    let green = parseInt(this.target().slice(2, 4), 16);
    let blue = parseInt(this.target().slice(4, 6), 16);

    let result = 0;
    let max = 765 * this.guesses().length;

    this.guesses().forEach(guess => {
      let gR = parseInt(guess.value[0] + guess.value[1], 16);
      let gG = parseInt(guess.value[2] + guess.value[3], 16);
      let gB = parseInt(guess.value[4] + guess.value[5], 16);

      result += Math.abs(red - gR) + Math.abs(green - gG) + Math.abs(blue - gB);
    });

    return Math.round(Math.floor(max - result) / max * 30) + Math.floor(Math.min(5 - this.guesses().length + 2, 5) / 5 * 70);
  });

  public getColorName = computed(() => {
      return GetColorName(this.target());
  });

  public copyToClipboard() {
    let text = "I got Hexclonle #" + this.gameId() + " in " + this.guesses().length + "! "
      + "Score: " + this.getScore() + "%\n\n";

    for (let guess of this.guesses()) {
      for (let digit of guess.distance) {
        text += this.getDistanceIndicator(digit);
      }
      text += "\n";
    }
    text += "\nhttps://tommclaughlan.github.io/hexclonle/"

    navigator.clipboard.writeText(text);

    this.copied.set(true);
  }

}
