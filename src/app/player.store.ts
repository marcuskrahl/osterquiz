import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { QuestionService } from './question.service';

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

  public questionService = inject(QuestionService);
  public questions = computed(() =>
    this.questionService.getQuestions(this.playerData().route ?? 'Innenstadt')
  );
  public answeredQuestions = computed(() =>
    this.questions().reduce(
      (sum, q) => (sum += this.playerData().answers[q.id] != undefined ? 1 : 0),
      0
    )
  );
  public correctAnswers = computed(() =>
    this.questions().reduce(
      (sum, q) => (sum += this.playerData().answers[q.id] === true ? 1 : 0),
      0
    )
  );
  public totalQuestions = computed(() => this.questions().length);

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
