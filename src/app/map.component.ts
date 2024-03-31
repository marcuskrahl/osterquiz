import { LocationChangeEvent } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  effect,
  inject,
} from '@angular/core';
import * as L from 'leaflet';
import { QuestionService, QuestionWithPosition } from './question.service';
import { PlayerStore } from './player.store';

@Component({
  selector: 'oq-map',
  template: `
    @if(!locationFix) {
    <div
      class="d-flex align-items-center justify-content-center map position-absolute, top-0, start-0"
    >
      <span class="fs-3">Laden</span>
    </div>
    }
    <div id="map" class="map" [class.invisible]="!locationFix"></div>
    <p [class.invisible]="!locationFix">
      Gehe zu den markierten Orten und beantworte die Fragen. Berühre die
      brennenden Häuser, um die Fragen zu beantworten.
    </p>
  `,
  standalone: true,
  styles: ['.map { width: 100%; height: 500px}'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private marker: L.Marker | undefined;
  private circle: L.Circle | undefined;
  public locationFix = false;

  private questionService = inject(QuestionService);

  @Input({ required: true })
  public route!: 'Innenstadt' | 'Gröba';

  @Output()
  public tooFar = new EventEmitter<void>();

  @Output()
  public showQuestion = new EventEmitter<QuestionWithPosition>();

  private ownLatLng: L.LatLng | undefined;

  private truckIcon = L.icon({
    iconUrl: '/assets/fw.png',
    shadowUrl: '',

    iconSize: [80, 58], // size of the icon
    shadowSize: [40, 64], // size of the shadow
    iconAnchor: [40, 29], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  private fireIcon = L.icon({
    iconUrl: '/assets/feuer.png',
    shadowUrl: '',

    iconSize: [50, 80], // size of the icon
    shadowSize: [40, 64], // size of the shadow
    iconAnchor: [25, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  private fireOutIcon = L.icon({
    iconUrl: '/assets/feuer_aus.png',
    shadowUrl: '',

    iconSize: [50, 80], // size of the icon
    shadowSize: [40, 64], // size of the shadow
    iconAnchor: [25, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  private questionMarkers: { [questionId: number]: L.Marker } = {};

  constructor(private playerStore: PlayerStore) {
    effect(() => {
      Object.keys(playerStore.playerData().answers).forEach((questionId) => {
        if (!isNaN(parseInt(questionId))) {
          this.questionMarkers[+questionId]?.setIcon(this.fireOutIcon);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    L.Icon.Default.imagePath = '/assets/';
    this.map = L.map('map').fitWorld();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.map.locate({ maxZoom: 16, watch: true, enableHighAccuracy: true });
    this.map.addEventListener('locationfound', (e) => this.locationFound(e));

    const questions = this.questionService.getQuestions(this.route);
    for (let question of questions) {
      const isAnswered =
        this.playerStore.playerData().answers[question.id] != undefined;
      this.questionMarkers[question.id] = L.marker(question.latlng)
        .setIcon(isAnswered ? this.fireOutIcon : this.fireIcon)
        .addTo(this.map)
        .addEventListener('click', () => this.handleClick(question));
    }
  }

  private handleClick(question: QuestionWithPosition): void {
    if (this.ownLatLng == undefined) {
      return this.tooFar.emit(undefined);
    } else if (
      question.latlng.distanceTo(this.ownLatLng) > 30 &&
      !window.location.search.includes('ignoreDistance')
    ) {
      return this.tooFar.emit(undefined);
    }
    this.showQuestion.emit(question);
  }

  private locationFound(e: L.LocationEvent): void {
    this.locationFix = true;
    var radius = 30; //e.accuracy;

    /*L.marker(e.latlng)
      .addTo(this.map)
      .bindPopup('You are within ' + radius + ' meters from this point')
      .openPopup();*/

    if (this.marker == undefined) {
      this.marker = L.marker(e.latlng)
        .setIcon(this.truckIcon)
        .addTo(this.map)
        .setZIndexOffset(-400);

      // Create an empty LatLngBounds object
      var bounds = new L.LatLngBounds(e.latlng, e.latlng);

      // Extend bounds with each point
      Object.values(this.questionMarkers).forEach(function (point) {
        bounds.extend(point.getLatLng());
      });

      // Fit the map to the bounds
      this.map.fitBounds(bounds);
      //this.map.setView(e.latlng, 16);
    } else {
      this.marker.setLatLng(e.latlng);
    }
    this.ownLatLng = e.latlng;

    if (this.circle == undefined) {
      this.circle = L.circle(e.latlng, radius).addTo(this.map);
    } else {
      this.circle.setLatLng(e.latlng).setRadius(radius);
    }
  }
}
