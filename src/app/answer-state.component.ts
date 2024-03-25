import { Component, computed, inject, input } from '@angular/core';
import { PlayerStore } from './player.store';
import { QuestionService } from './question.service';

@Component({
  selector: 'oq-answer-state',
  template: `{{ answeredQuestions() }} von {{ totalQuestions() }} Fragen
    beantwortet`,
  standalone: true,
})
export class AnswerStateComponent {
  public route = input.required<'Innenstadt' | 'Gröba'>();
  public playerStore = inject(PlayerStore);
  public playerData = this.playerStore.playerData;
  public answeredQuestions = this.playerStore.answeredQuestions;
  public totalQuestions = this.playerStore.totalQuestions;
}
