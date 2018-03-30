import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LatLng } from '../../../shared/LatLng';

import { MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

declare var google;


@Injectable()
export class GeolocationProvider {
  userLocation$: Observable<LatLng | undefined>;
  geocoder;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private geolocation: Geolocation) {

    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
    }); // TODO: maybe factor this out since I can't make this async/await inside the constructor

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


  async geocode(address: string): Promise<LatLng | null> {
    await this.mapsAPILoader.load();
    return new Promise<LatLng | null>(resolve => {
      this.geocoder.geocode({address}, results => {
        if (results) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          resolve(null);
        }
      })
    }) // TODO: is this as far as I can refactor with async/await?
  }
}
