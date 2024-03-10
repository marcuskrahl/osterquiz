import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';

export interface QuestionOption {
  answer: string;
  correct: boolean;
}
export interface Question {
  id: number;
  questionText: string;
  questionOptions: QuestionOption[];
}

export type QuestionWithPosition = Question & { latlng: LatLng };

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  public readonly baseQuestions: readonly Question[] = [
    {
      id: 1,
      questionText: 'Wie lang ist ein 20 Meter B-Schlauch?',
      questionOptions: [
        { answer: '15 Meter', correct: false },
        { answer: '20 Meter', correct: true },
        { answer: '30 Meter', correct: false },
      ],
    },
    {
      id: 2,
      questionText: 'Wie lang ist ein 20 Meter C-Schlauch?',
      questionOptions: [
        { answer: '15 Meter', correct: false },
        { answer: '20 Meter', correct: true },
        { answer: '30 Meter', correct: false },
      ],
    },
    {
      id: 3,
      questionText: 'Wie lang ist ein 15 Meter C-Schlauch?',
      questionOptions: [
        { answer: '15 Meter', correct: true },
        { answer: '20 Meter', correct: false },
        { answer: '30 Meter', correct: false },
      ],
    },
  ];

  private coordinatesInnenstadt: { [key: number]: LatLng } = {
    1: new LatLng(51.308056, 13.293889),
    2: new LatLng(51.30427, 13.31283),
    3: new LatLng(51.30275, 13.31237),
  };

  public getQuestions(route: 'Innenstadt' | 'Gröba'): QuestionWithPosition[] {
    if (route == 'Innenstadt') {
      return this.baseQuestions.map((q) => ({
        ...q,
        latlng: this.coordinatesInnenstadt[q.id],
      }));
    } else {
      return [];
    }
  }
}
