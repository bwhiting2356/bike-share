import { Component, ViewChild, Input, OnChanges, OnInit } from '@angular/core';

// shared

import { LatLng } from '../../../shared/LatLng';
import { bicyclePolylineBorderColor, bicyclePolylineMainColor } from '../../../shared/ThemeVariables';
import { MapsAPILoader } from '@agm/core';

declare var google;

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent implements OnChanges, OnInit {
  @ViewChild('mapContainer') mapContainer;
  @Input() zoom: number = 14;
  @Input() zoomControl: boolean = false;
  @Input() scrollWheel: boolean = true;
  @Input() streetViewControl: boolean = false;
  @Input() gestureHandling: string = 'greedy';
  @Input() fullscreenControl: boolean = true;
  @Input() center: LatLng;
  @Input() origin: LatLng;
  @Input() destination: LatLng;
  @Input() stationStart: LatLng;
  @Input() stationEnd: LatLng;
  @Input() walking1Points: LatLng[];
  @Input() walking2Points: LatLng[];
  @Input() bicyclingPoints: LatLng[];
  @Input() stationList: LatLng[];
  @Input() collapsed: boolean; // this is only here to trigger change detection when the size changes
  map: any;
  stationMarkers = [];

  constructor(private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.initMap();
  }

  initMap() {
    this.mapsAPILoader.load().then(() => {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        zoom: this.zoom,
        maxZoom: 16,
        center: this.center,
        disableDefaultUI: true,
        zoomControl: this.zoomControl,
        streetViewControl: this.streetViewControl,
        gestureHandling: this.gestureHandling,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            stylers: [{visibility: '#off'}]
          },
        ]
      });
      this.map.setCenter(this.center);

      if (this.origin) this.addMarker(this.origin); // TODO: why is it not showing up with just one marker?
      if (this.destination) this.addMarker(this.destination);

      if (this.origin || this.destination) this.fitBounds();

      if (this.stationStart) this.addMarker(this.stationStart, true);
      if (this.stationEnd) this.addMarker(this.stationEnd, true);

      this.addOrRemoveStationMarkers();

      this.map.addListener('zoom_changed', () => {
        this.addOrRemoveStationMarkers();
      })

      if (this.walking1Points) this.addPolyline(this.walking1Points, GoogleMapComponent.WALKING);
      if (this.walking2Points) this.addPolyline(this.walking2Points, GoogleMapComponent.WALKING);
      if (this.bicyclingPoints) this.addPolyline(this.bicyclingPoints, GoogleMapComponent.BICYCLING);

    })
  }

  fitBounds() {
    let bounds = new google.maps.LatLngBounds();
    if (this.origin) bounds.extend(this.origin);
    if (this.walking1Points) {
      this.walking1Points.forEach(points => bounds.extend(points));
    }
    if (this.stationStart) bounds.extend(this.stationStart);
    if (this.bicyclingPoints) {
      this.bicyclingPoints.forEach(points => bounds.extend(points));
    }
    if (this.stationEnd) bounds.extend(this.stationEnd);
    if (this.walking2Points) {
      this.walking2Points.forEach(points => bounds.extend(points));
    }
    if (this.destination) bounds.extend(this.destination);
    this.map.fitBounds(bounds, 20); // 20px padding
  }

  addMarker(position, station = false) {
    const url = station ? '/assets/imgs/station.svg' : '/assets/imgs/pin.svg'

    let markerOptions = {
      position: position,
      map: this.map,
      icon: {
        url: url
      }
    };

    return new google.maps.Marker(markerOptions);
  }

  addOrRemoveStationMarkers() {
    if (this.stationList && this.map.getZoom() >= 14) {
      this.stationList.forEach(station => {
        this.stationMarkers.push(this.addMarker(station, true));
      });
    } else {
      if (this.stationMarkers) {
        this.stationMarkers.forEach(marker => marker.setMap(null))
      }
    }
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
      strokeColor: bicyclePolylineMainColor,
      strokeOpacity: 1,
      strokeWeight: 5,
      zIndex: 1,
    });
  }

  static createBicyclingPolylineBorder(points) {
    return new google.maps.Polyline({
      path: points,
      strokeColor: bicyclePolylineBorderColor,
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
}


