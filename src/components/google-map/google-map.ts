import { Component, ViewChild, Input, OnChanges } from '@angular/core';

import { LatLng } from '../../shared/LatLng';

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
  @Input() station1: LatLng;
  @Input() station2: LatLng;
  @Input() destination: LatLng;
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
        title: 'Origin'
      });
    }

    if (this.station1) {
      let station1Marker = new google.maps.Marker({
        position: this.station1,
        map: this.map,
        title: 'Station 1'
      });
    }

    if (this.station2) {
      let station2Marker = new google.maps.Marker({
        position: this.station2,
        map: this.map,
        title: 'Station 2'
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
  }

  fitBounds() {
    let bounds = new google.maps.LatLngBounds();
    if (this.origin) bounds.extend(this.origin);
    if (this.station1) bounds.extend(this.station1);
    if (this.station2) bounds.extend(this.station2);
    if (this.destination) bounds.extend(this.destination);
    this.map.fitBounds(bounds);
  }
}

