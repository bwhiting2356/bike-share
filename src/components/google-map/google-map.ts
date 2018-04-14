import { Component, ViewChild, Input, OnChanges, OnInit, ElementRef } from '@angular/core';

// shared

import { LatLng } from '../../../shared/LatLng';
import { bicyclePolylineBorderColor, bicyclePolylineMainColor } from '../../../shared/ThemeVariables';
import { MapsAPILoader } from '@agm/core';
import { clientMapGeoPointToLatLng } from "../../providers/firestore/clientMapGeoPointToLatLng";


const DEFAULT_LOCATION: LatLng = { lat: 40.724910, lng: -73.995480 };
declare var google: any;

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent implements OnChanges, OnInit {
  @ViewChild('mapContainer') mapContainer: ElementRef | undefined;
  @Input() zoom: number = 14;
  @Input() zoomControl: boolean = false;
  @Input() scrollWheel: boolean = true;
  @Input() streetViewControl: boolean = false;
  @Input() gestureHandling: string = 'greedy';
  @Input() fullscreenControl: boolean = true;
  @Input() center: LatLng | undefined;
  @Input() originCoords: LatLng | undefined;
  @Input() originAddress: string | undefined;
  @Input() destinationCoords: LatLng | undefined;
  @Input() destinationAddress: string | undefined;
  @Input() stationStartCoords: LatLng | undefined;
  @Input() stationStartAddress: string | undefined;
  @Input() stationEndCoords: LatLng | undefined;
  @Input() stationEndAddress: string | undefined;
  @Input() walking1Points: LatLng[] | undefined;
  @Input() walking2Points: LatLng[] | undefined;
  @Input() bicyclingPoints: LatLng[] | undefined;
  @Input() stationList: any[] | undefined;
  @Input() collapsed: boolean = false; // this is only here to trigger change detection when the size changes
  map: any;
  stationMarkers: any[] = [];
  openWindow: any | null;

  constructor(private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.initMap(); // TODO: maybe just change the map instead of making a new one (and have smoother panning)
  }

  async initMap() {
    await this.mapsAPILoader.load();

    if (this.mapContainer) {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        zoom: this.zoom,
        maxZoom: 16,
        center: this.center || DEFAULT_LOCATION,
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

      if (this.originCoords) this.addMarker(this.originCoords, this.originAddress);
      if (this.destinationCoords) this.addMarker(this.destinationCoords, this.destinationAddress);

      if (this.originCoords || this.destinationCoords) this.fitBounds();

      if (this.stationStartCoords) this.addMarker(this.stationStartCoords, this.stationStartAddress, true);
      if (this.stationEndCoords) this.addMarker(this.stationEndCoords, this.stationEndAddress, true);

      this.addOrRemoveStationMarkers();

      this.map.addListener('zoom_changed', () => {
        this.addOrRemoveStationMarkers();
      });

      if (this.walking1Points) this.addPolyline(this.walking1Points, GoogleMapComponent.WALKING);
      if (this.walking2Points) this.addPolyline(this.walking2Points, GoogleMapComponent.WALKING);
      if (this.bicyclingPoints) this.addPolyline(this.bicyclingPoints, GoogleMapComponent.BICYCLING);
    }
  }

  fitBounds() {
    let bounds = new google.maps.LatLngBounds();
    if (this.originCoords) bounds.extend(this.originCoords);
    if (this.walking1Points) {
      this.walking1Points.forEach(points => bounds.extend(points));
    }
    if (this.stationStartCoords) bounds.extend(this.stationStartCoords);
    if (this.bicyclingPoints) {
      this.bicyclingPoints.forEach(points => bounds.extend(points));
    }
    if (this.stationEndCoords) bounds.extend(this.stationEndCoords);
    if (this.walking2Points) {
      this.walking2Points.forEach(points => bounds.extend(points));
    }
    if (this.destinationCoords) bounds.extend(this.destinationCoords);
    this.map.fitBounds(bounds, 20); // 20px padding
  }

  addMarker(position: LatLng, address: string | undefined, station = false) {
    const infoWindow = new google.maps.InfoWindow({
      content: address || 'unknown address'
    });

    const markerOptions = {
      position: position,
      map: this.map,
      icon: {
        url: station
          ? '/assets/imgs/station.svg'
          : '/assets/imgs/pin.svg'
      }
    };

    const marker = new google.maps.Marker(markerOptions);
    marker.addListener('click', () => {
      if (this.openWindow) this.openWindow.close(this.map);
      this.openWindow = infoWindow;
      this.openWindow.open(this.map, marker);
    });
    return marker;
  }

  addOrRemoveStationMarkers() {
    if (this.stationList && this.map.getZoom() >= 14) {
      this.stationList.forEach(station => {
        const { address, coords } = station;
        const marker = this.addMarker(clientMapGeoPointToLatLng(coords), address, true);
        this.stationMarkers.push(marker);
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

  static createBicyclingPolyline(points: LatLng[]) {
    return new google.maps.Polyline({
      path: points,
      strokeColor: bicyclePolylineMainColor,
      strokeOpacity: 1,
      strokeWeight: 5,
      zIndex: 1,
    });
  }

  static createBicyclingPolylineBorder(points: LatLng[]) {
    return new google.maps.Polyline({
      path: points,
      strokeColor: bicyclePolylineBorderColor,
      strokeOpacity: 1,
      strokeWeight: 7,
      zIndex: 0,
    });
  }

  static createWalkingPolyline(points: LatLng[]) {
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

  static createWalkingPolylineBorder(points: LatLng[]) {
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



