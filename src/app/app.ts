import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Game} from './game/game';
import {Header} from "./header/header";

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
