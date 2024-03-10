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
  public playerData = inject(PlayerStore).playerData;
  public questionService = inject(QuestionService);
  public questions = computed(() =>
    this.questionService.getQuestions(this.route())
  );
  public answeredQuestions = computed(() =>
    this.questions().reduce(
      (sum, q) => (sum += this.playerData().answers[q.id] != undefined ? 1 : 0),
      0
    )
  );
  public totalQuestions = computed(() => this.questions().length);
}
