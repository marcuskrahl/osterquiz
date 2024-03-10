import { Injectable, effect, signal } from '@angular/core';

interface PlayerData {
  route: 'Innenstadt' | 'Gröba' | undefined;
  answers: {
    [questionId: number]: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PlayerStore {
  private readonly defaultPlayerData: PlayerData = {
    route: undefined,
    answers: {},
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
