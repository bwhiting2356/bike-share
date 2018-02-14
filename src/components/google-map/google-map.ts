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
      styles: [
        {
          featureType: 'poi',
          stylers: [{visibility: '#off'}]
        },
      ]
    });

    if (this.origin) {
      let originMarker = new google.maps.Marker({
        position: this.origin,
        map: this.map,
        title: 'Origin',
      });
    }

    if (this.stationStart) {
      let stationStartMarker = new google.maps.Marker({
        position: this.stationStart,
        map: this.map,
        title: 'Station Start',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10
        },
      });
    }

    if (this.stationEnd) {
      let stationEndMarker = new google.maps.Marker({
        position: this.stationEnd,
        map: this.map,
        title: 'Station End',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10
        },
      });
    }

    if (this.destination) {
      let destinationMarker = new google.maps.Marker({
        position: this.destination,
        map: this.map,
        title: 'Destination'
      });
    }
    if (this.origin || this.destination) this.fitBounds();

    if (this.stationList) {
      this.stationList.forEach(station => {
        new google.maps.Marker({
          position: station,
          map: this.map,
          title: 'Station',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10
          },
        });
      })
    }

    if (this.walking1Points) {
      var flightPath = new google.maps.Polyline({
        path: this.walking1Points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      flightPath.setMap(this.map);
    }

    if (this.walking2Points) {
      var flightPath = new google.maps.Polyline({
        path: this.walking2Points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      flightPath.setMap(this.map);
    }

    if (this.bicyclingPoints) {
      var flightPath = new google.maps.Polyline({
        path: this.bicyclingPoints,
        geodesic: true,
        strokeColor: 'blue',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      flightPath.setMap(this.map);
    }
  }

  fitBounds() {
    let bounds = new google.maps.LatLngBounds();
    if (this.origin) bounds.extend(this.origin);
    if (this.stationStart) bounds.extend(this.stationStart);
    if (this.stationEnd) bounds.extend(this.stationEnd);
    if (this.destination) bounds.extend(this.destination);
    this.map.fitBounds(bounds);
  }
}
