import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';

export interface QuestionOption {
  answer: string;
  correct: boolean;
}
export interface Question {
  id: number;
  questionText: string;
  questionExtension?: string;
  questionOptions: QuestionOption[];
  answerText: string;
}

export type QuestionWithPosition = Question & { latlng: LatLng };

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  public readonly baseQuestions: readonly Question[] = [
    {
      id: 1,
      questionText:
        'Welches Jubiläum feiert die Feuerwehr Riesa in diesem Jahr?',
      questionOptions: [
        { answer: '75 Jahre', correct: false },
        { answer: '150 Jahre', correct: true },
        { answer: '300 Jahre', correct: false },
      ],
      answerText:
        'Die Feuerwehr Riesa wurde im Jahr 1874 gegründet und feiert damit dieses Jahr ihr 150 jähriges Bestehen. Dazu finden Ende August Festveranstaltungen statt, zu denen auch die Bevölkerung eingeladen ist.',
    },
    {
      id: 2,
      questionText:
        'Unter welcher Telefonnummer erreicht man die Feuerwehr im Notfall?',
      questionOptions: [
        { answer: '110', correct: false },
        { answer: '111', correct: false },
        { answer: '112', correct: true },
      ],
      answerText:
        'Unter der Nummer 112 erreicht man die Rettungsleitstelle, die Notrufe für die Feuerwehr und den Rettungsdienst entgegen nimmt. Diese Nummer ist übrigens in allen Ländern der EU und vielen weiteren europäischen Ländern für den Notruf reserviert.',
    },
    {
      id: 3,
      questionText: 'Wie viele Einsatzkräfte hat die Feuerwehr Riesa?',
      questionOptions: [
        { answer: '12', correct: false },
        { answer: '48', correct: false },
        { answer: '115', correct: true },
      ],
      answerText:
        'Die Feuerwehr Riesa verfügt mit Stand 2023 über 115 Einsatzkräfte. Die meisten davon übernehmen diese Aufgabe ehrenamtlich.',
    },
    {
      id: 4,
      questionText: 'Wofür steht die Abkürzung TLF bei der Feuerwehr?',
      questionOptions: [
        { answer: 'Tierlachfreunde', correct: false },
        { answer: 'Tanklöschfahrzeug', correct: true },
        { answer: 'Trockenluftfontäne', correct: false },
      ],
      answerText:
        'Die Abkürzung TLF steht für Tanklöschfahrzeug. Riesa verfügt über ein Tanklöschfahrzeug, das bei der Stadtteilfeuerwehr Riesa-Stadt positioniert ist und überörtlich unter anderem bei Waldbränden ausrückt.',
    },
    {
      id: 5,
      questionText: 'Wie viele Stadtteilfeuerwehren hat Riesa?',
      questionOptions: [
        { answer: '1', correct: false },
        { answer: '3', correct: false },
        { answer: '7', correct: true },
      ],
      answerText:
        'Riesa hat im Stadtgebiet drei Stadtteilfeuerwehren: In der Innenstadt, in Gröba und in Weida. Weiterhin gibt es Wachen in den umliegenden Dörfern in Canitz, Nickritz und Leutewitz. Zu guter Letzt gibt es noch die Hauptwache, die durch hauptamtliche Kräfte rund um die Uhr besetzt ist.',
    },
  ];

  private coordinatesInnenstadt: { [key: number]: LatLng } = {
    1: new LatLng(51.30599105178189, 13.31040527478198), // Jahna Brücke Bootshaus
    2: new LatLng(51.304036186864884, 13.3127932224935), // Freitreppe
    3: new LatLng(51.30292, 13.31583), //Jahna Brücke Tiergarten + Reiter
    4: new LatLng(51.30623507534618, 13.318186574746576), //ecke reiter nähe Marinekameradschaft
    5: new LatLng(51.305441519639736, 13.314277625203525), //mitte stadtpark
  };

  private coordinatesGroeba: { [key: number]: LatLng } = {
    1: new LatLng(51.3205240881135, 13.289935730528523), // Schlossbrücke
    2: new LatLng(51.31845039412303, 13.290210279463414), //horch und guck
    3: new LatLng(51.31766005722609, 13.282692092128695), // Ebertplatz
    4: new LatLng(51.32157060198462, 13.289108423801267), //Schlosspark
    5: new LatLng(51.320650211155126, 13.27967498327645), //Hafen
  };

  public getQuestions(route: 'Innenstadt' | 'Gröba'): QuestionWithPosition[] {
    if (route == 'Innenstadt') {
      return this.baseQuestions.map((q) => ({
        ...q,
        latlng: this.coordinatesInnenstadt[q.id],
      }));
    } else {
      return this.baseQuestions.map((q) => ({
        ...q,
        latlng: this.coordinatesGroeba[q.id],
      }));
    }
  }
}
