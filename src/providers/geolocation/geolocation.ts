import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';;
import { Geolocation } from '@ionic-native/geolocation';
import { LatLng } from '../../../shared/LatLng';

import { MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

declare var google;

@Injectable()
export class GeolocationProvider {
  userLocation$: Observable<LatLng>;
  geocoder;

  constructor(
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private geolocation: Geolocation) {

    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
    });

    const options: PositionOptions = {
      maximumAge: Infinity
    };

    this.userLocation$ = this.geolocation.watchPosition(options)
      .pipe(
        map(geoposition => {
          if (geoposition && geoposition.coords) {
            return { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude };
          }
        })
      )

  }

  geocode(address): Promise<LatLng> {
    return new Promise(resolve => {
      this.mapsAPILoader.load().then(() => {
        this.geocoder.geocode({ address }, results => {
          if (results) {
            const coords = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
            resolve(coords);
          } else {
            resolve(null);
          }
        })
      });
    })
  }
}
