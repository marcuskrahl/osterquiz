import { LocationChangeEvent } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, inject } from '@angular/core';
import * as L from 'leaflet';
import { QuestionService } from './question.service';

@Component({
  selector: 'oq-map',
  template: `
    <div id="map" class="map" [class.invisible]="!locationFix"></div>
    @if(!locationFix) {
    <div
      class="d-flex align-items-center justify-content-center map position-absolute, top-0, start-0"
    >
      <span>Laden</span>
    </div>
    }
    <p [class.invisible]="!locationFix">
      Gehe zu den markierten Orten und beantworte die Fragen
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

  ngAfterViewInit(): void {
    this.map = L.map('map').fitWorld();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.map.locate({ setView: true, maxZoom: 16, watch: true });
    this.map.addEventListener('locationfound', (e) => this.locationFound(e));

    const questions = this.questionService.getQuestions(this.route);
    for (let question of questions) {
      L.marker(question.latlng).addTo(this.map);
    }
  }

  private locationFound(e: L.LocationEvent): void {
    this.locationFix = true;
    var radius = e.accuracy;

    /*L.marker(e.latlng)
      .addTo(this.map)
      .bindPopup('You are within ' + radius + ' meters from this point')
      .openPopup();*/

    if (this.marker == undefined) {
      this.marker = L.marker(e.latlng).addTo(this.map);
    } else {
      this.marker.setLatLng(e.latlng);
    }

    if (this.circle == undefined) {
      this.circle = L.circle(e.latlng, radius).addTo(this.map);
    } else {
      this.circle.setLatLng(e.latlng).setRadius(radius);
    }
  }
}
