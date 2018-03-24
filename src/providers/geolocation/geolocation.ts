import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';;
import { Geolocation } from '@ionic-native/geolocation';
import { LatLng } from '../../../shared/LatLng';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';

declare var google;

@Injectable()
export class GeolocationProvider {
  foundPosition: BehaviorSubject<boolean>;
  userLocation$: BehaviorSubject<LatLng>;
  geocoder;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private geolocation: Geolocation) {
    this.foundPosition = new BehaviorSubject(false);
    this.userLocation$ = new BehaviorSubject(null);

    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
    });

    this.geolocation.watchPosition()
      .subscribe(geoposition => {
        if (geoposition && geoposition.coords) {
          this.userLocation$.next({ lat: geoposition.coords.latitude, lng: geoposition.coords.longitude })
        }
      })
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
