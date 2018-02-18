import { Component, ViewChild, Input, OnChanges } from '@angular/core';
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

    if (this.walking1Points) this.addPolyline(this.walking1Points, GoogleMapComponent.WALKING);
    if (this.walking2Points) this.addPolyline(this.walking2Points, GoogleMapComponent.WALKING);
    if (this.bicyclingPoints) this.addPolyline(this.bicyclingPoints, GoogleMapComponent.BICYCLING);
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
    const color = station ? 'blue' : 'red';  // TODO: put in theme colors
    let markerOptions = {
      position: position,
      map: this.map,
      icon: GoogleMapComponent.pinSymbol(color)
    };

    // TODO: z-index lower?

    new google.maps.Marker(markerOptions);
  }

  addPolyline(points: LatLng[], mode: string) {
    if (mode === GoogleMapComponent.WALKING) {
      const walkingPolyline = GoogleMapComponent.createWalkingPolyline(points);
      walkingPolyline.setMap(this.map);
      const walkingPolylineBorder = GoogleMapComponent.createWalkingPolylineBorder(points);
      walkingPolylineBorder.setMap(this.map);

    } else if (mode === GoogleMapComponent.BICYCLING) {
      const bicyclingPolyline = GoogleMapComponent.createBicyclingPolyline(points);
      bicyclingPolyline.setMap(this.map);
      const bicyclingPolylineBorder = GoogleMapComponent.createBicyclingPolylineBorder(points);
      bicyclingPolylineBorder.setMap(this.map);
    }
  }

  // ***************   static properties and methods ***************

  static WALKING = 'WALKING';
  static BICYCLING = 'BICYCLING';

  static createBicyclingPolyline(points) {
    return new google.maps.Polyline({
      path: points,
      strokeColor: '#00B3FD',
      strokeOpacity: 1,
      strokeWeight: 5,
      zIndex: 1,
    });
  }

  static createBicyclingPolylineBorder(points) {
    return new google.maps.Polyline({
      path: points,
      strokeColor: '#3379C3',
      strokeOpacity: 1,
      strokeWeight: 7,
      zIndex: 0,
    });
  }

  static createWalkingPolyline(points) {
    const walkingLineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 4
    };

    return new google.maps.Polyline({
      path: points,
      strokeColor: 'white',
      strokeOpacity: 0,
      strokeWeight: 4,
      zIndex: 3,
      icons: [{
        icon: walkingLineSymbol,
        offset: '0',
        repeat: '15px'
      }],
    });
  }

  static createWalkingPolylineBorder(points) {
    const walkingLineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 5
    };

    return new google.maps.Polyline({
      path: points,
      // geodesic: true,
      strokeColor: 'black',
      strokeOpacity: 0,
      strokeWeight: 5,
      zIndex: 2,
      icons: [{
        icon: walkingLineSymbol,
        offset: '0',
        repeat: '15px'
      }],
    });
  }

  static pinSymbol(color: string) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1
    };
  }
}


