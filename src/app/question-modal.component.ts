import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Question, QuestionOption } from './question.service';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { PlayerStore } from './player.store';

@Component({
  selector: 'oq-question-modal',
  template: `
    <div
      class="modal fade"
      id="exampleModal"
      #modalRef
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Frage {{ question?.id }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="lead">{{ question?.questionText }}</p>
            @if (answered == false) {
            <div>
              @for(a of question?.questionOptions; track a.answer; let i =
              $index) {
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="answer"
                  id="answer_{{ i }}"
                  [value]="a"
                  [(ngModel)]="selectedAnswer"
                />
                <label class="form-check-label" for="answer_{{ i }}">
                  {{ a.answer }}
                </label>
              </div>
              }
            </div>
            } @else { @if (answered == 'correct') {

            <span class="text-success">Die Frage wurde richtig beanwortet</span>
            } @else {
            <span class="text-danger">Die Frage wurde falsch beantwortet</span>
            }
            <p class="mt-3">{{ question?.answerText }}</p>
            }
          </div>
          <div class="modal-footer">
            @if(answered === false) {

            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Abbrechen
            </button>
            <button
              (click)="answer()"
              type="button"
              class="btn btn-primary"
              [disabled]="selectedAnswer == undefined"
            >
              Antwort abschicken
            </button>
            } @else {
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class QuestionModalComponent {
  public question: Question | undefined;
  public modal: bootstrap.Modal | undefined;

  @ViewChild('modalRef', {
    read: ElementRef,
  })
  public modalRef: ElementRef | undefined;

  public selectedAnswer: QuestionOption | undefined;
  public answered: 'correct' | 'incorrect' | false = false;

  public playerStore = inject(PlayerStore);

  public ngAfterViewInit(): void {
    this.modal = new bootstrap.Modal(this.modalRef?.nativeElement);
  }
  public show(question: Question): void {
    if (this.modal == undefined) {
      return;
    }
    const prevAnswer = this.playerStore.playerData().answers[question.id];
    this.answered =
      prevAnswer != undefined ? (prevAnswer ? 'correct' : 'incorrect') : false;
    this.selectedAnswer = undefined;
    this.question = question;
    this.modal.show();
  }

  public answer(): void {
    const selectedAnswer = this.selectedAnswer;
    const question = this.question;
    if (selectedAnswer == undefined || question == undefined) {
      return;
    }
    this.answered = selectedAnswer.correct ? 'correct' : 'incorrect';
    this.playerStore.playerData.update((pd) => ({
      ...pd,
      answers: {
        ...pd.answers,
        [question.id]: selectedAnswer.correct,
      },
    }));
  }
}
