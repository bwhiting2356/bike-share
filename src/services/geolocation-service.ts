import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import 'rxjs/add/operator/mergeMap';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LatLng } from '../../shared/LatLng';

declare var google;

@Injectable()
export class GeolocationService {
  foundPosition: BehaviorSubject<boolean>;
  userLocation$: BehaviorSubject<LatLng>;
  geocoder;

  constructor(
    private zone: NgZone,
    private geolocation: Geolocation) {
    this.foundPosition = new BehaviorSubject(false);
    this.userLocation$ = new BehaviorSubject(null)
    this.geocoder = new google.maps.Geocoder;
    this.geolocation.watchPosition().subscribe(geoposition => {
      this.foundPosition.next(true);
      this.userLocation$.next({ lat: geoposition.coords.latitude, lng: geoposition.coords.longitude })
    })
  }  // TODO: is this bad design, to push a values into a subject inside of a subscribe function?

  geocode(address): Promise<LatLng> {
    return new Promise(resolve => {
      return this.geocoder.geocode({"address": address }, results => {
        const coords = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
        resolve(coords);
      })
    })
  }
}
