import { Injectable, NgZone } from '@angular/core';
import { LatLng } from '../shared/LatLng';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/mergeMap';

import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Injectable()
export class GeolocationService {
  userLocation$: BehaviorSubject<LatLng>;
  userAddress$: BehaviorSubject<string>;
  geocoder;

  constructor(
    private zone: NgZone,
    private geolocation: Geolocation) {
    this.geocoder = new google.maps.Geocoder;
    this.userLocation$ = new BehaviorSubject({lat: 0, lng: 0})
    this.userAddress$ = new BehaviorSubject("");

    this.userLocation$.subscribe(latlng => {
      this.geocoder.geocode({location: latlng}, results => {
        if (results && results[0]) {
          this.userAddress$.next(results[0].formatted_address);
        }
      })
    });
  }

  getCurrentPosition() {
    this.geolocation.watchPosition()
      .subscribe(position => {
        if (position) {
          console.log("position", position);
          this.userLocation$.next({ lat: position.coords.latitude, lng: position.coords.longitude });
        }
      })

    // TODO: is this bad design, to push a value into a subject inside of a subscribe function?
  }

  geocode(address): Promise<LatLng> {
    return new Promise(resolve => {
      return this.geocoder.geocode({"address": address }, results => {
        const coords = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
        resolve(coords);
      })
    })
  }
}
