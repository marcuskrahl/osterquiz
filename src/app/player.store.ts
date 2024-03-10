import { Injectable, effect, signal } from '@angular/core';

interface PlayerData {
  route: 'Innenstadt' | 'Gröba' | undefined;
  answered: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerStore {
  private readonly defaultPlayerData: PlayerData = {
    route: undefined,
    answered: 0,
  };

  playerData = signal(this.getFromStore() ?? this.defaultPlayerData);

  constructor() {
    effect(() => {
      window.localStorage.setItem(
        'playerData',
        JSON.stringify(this.playerData())
      );
    });
  }
  private getFromStore(): PlayerData | undefined {
    const data = window.localStorage.getItem('playerData');
    if (data != undefined) {
      return JSON.parse(data);
    }
    return undefined;
  }
}
