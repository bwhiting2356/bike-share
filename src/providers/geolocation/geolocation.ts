import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';;
import { Geolocation } from '@ionic-native/geolocation';
import { LatLng } from '../../../shared/LatLng';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

declare var google;

@Injectable()
export class GeolocationProvider {
  foundPosition: BehaviorSubject<boolean>;
  userLocation$: Observable<LatLng>;
  geocoder;

  constructor(
    private geolocation: Geolocation) {
    this.foundPosition = new BehaviorSubject(false);
    this.userLocation$ = new BehaviorSubject(null);
    this.geocoder = new google.maps.Geocoder;
    this.userLocation$ = this.geolocation.watchPosition()
      .pipe(
        map(geoposition => {
          if (geoposition && geoposition.coords) {
            return { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude };
          } else {
            return null;
          }
        })
      );
  }

  geocode(address): Promise<LatLng> {
    return new Promise(resolve => {
      return this.geocoder.geocode({ address }, results => {
        const coords = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        resolve(coords);
      })
    })
  }
}
