import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './map.component';
import { PlayerStore } from './player.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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
