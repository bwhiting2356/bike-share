import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from "rxjs/Observable";
import { LatLng } from '../shared/LatLng';

interface GeoPoint {
  coords: {
    _lat: number;
    _long: number;
  }
}

@Injectable()
export class FirestoreService {
  stationList: Observable<LatLng[]>;

  constructor(private db: AngularFirestore) {

    this.stationList = this.db.collection('stations').valueChanges().map((geopoints: GeoPoint[]) => {
      return geopoints.map(geopoint => {
        return { lat: geopoint.coords._lat, lng: geopoint.coords._long };
      })
    });


  }
}
