import { Component, ViewChild, Input, OnChanges, OnInit } from '@angular/core';
import { LatLng } from '../../../shared/LatLng';

declare var google;

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent implements OnChanges {
  @ViewChild('mapContainer') mapContainer;
  @Input() zoom: number = 14;
  @Input() zoomControl: boolean = true;
  @Input() scrollWheel: boolean = true;
  @Input() streetViewControl: boolean = false;
  @Input() gestureHandling: string = 'greedy';
  @Input() center: LatLng;
  @Input() origin: LatLng;
  @Input() destination: LatLng;
  @Input() stationStart: LatLng;
  @Input() stationEnd: LatLng;
  @Input() walking1Points: LatLng[];
  @Input() walking2Points: LatLng[];
  @Input() bicyclingPoints: LatLng[];

  /**
   *
   *     [scrollwheel]="false"
   [fitBounds]="bounds"
   [zoomControl]="false"
   [streetViewControl]="false"
   gestureHandling: 'none',
   zoomControl: false
   */

  @Input() stationList: LatLng[];
  map: any;

  constructor() { }

  ngOnChanges() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: this.zoom,
      maxZoom: 16,
      center: this.center,
      disableDefaultUI: true,
      zoomControl: this.zoomControl,
      streetViewControl: this.streetViewControl,
      gestureHandling: this.gestureHandling,
      styles: [
        {
          featureType: 'poi',
          stylers: [{visibility: '#off'}]
        },
      ]
    });

    if (this.origin) this.addMarker(this.origin);
    if (this.destination) this.addMarker(this.destination);
    if (this.origin || this.destination) this.fitBounds();

    if (this.stationStart) this.addMarker(this.stationStart, true);
    if (this.stationEnd) this.addMarker(this.stationEnd, true);

    if (this.stationList) {
      this.stationList.forEach(station => this.addMarker(station, true));
    }

    if (this.walking1Points) this.addPolyline(this.walking1Points, WALKING);
    if (this.walking2Points) this.addPolyline(this.walking2Points, WALKING);
    if (this.bicyclingPoints) this.addPolyline(this.bicyclingPoints, BICYCLING);
  }

  fitBounds() {
    let bounds = new google.maps.LatLngBounds();
    if (this.origin) bounds.extend(this.origin);
    if (this.stationStart) bounds.extend(this.stationStart);
    if (this.stationEnd) bounds.extend(this.stationEnd);
    if (this.destination) bounds.extend(this.destination);
    this.map.fitBounds(bounds);
  }

  addMarker(position, station = false) {
    let markerOptions = {
      position: position,
      map: this.map,
    };

    if (station) {
      markerOptions["icon"] = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10
      }
    }
    new google.maps.Marker(markerOptions);
  }

  addPolyline(points, mode) {
    let path;
    if (mode === WALKING) {
      path = new google.maps.Polyline({
        path: this.walking1Points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    } else if (mode === BICYCLING) {
      path = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: 'blue',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    }

    path.setMap(this.map);
  }
}

const WALKING = 'WALKING';
const BICYCLING = 'BICYCLING';
