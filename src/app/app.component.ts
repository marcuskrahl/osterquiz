import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './map.component';
import { PlayerStore } from './player.store';
import { TooFarToastComponent } from './too-far-toast.component';
import { QuestionModalComponent } from './question-modal.component';
import { AnswerStateComponent } from './answer-state.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    MapComponent,
    TooFarToastComponent,
    QuestionModalComponent,
    AnswerStateComponent,
  ],
})
export class AppComponent {
  title = 'osterquiz';
  playerStore = inject(PlayerStore);

  setRoute(route: 'Innenstadt' | 'Gröba'): void {
    this.playerStore.playerData.update((pd) => ({
      ...pd,
      route,
    }));
  }
}
