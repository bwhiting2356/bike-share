import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { LatLng } from '../../shared/LatLng';
import { mapLatLngToGeoPoint } from '../../shared/mapLatLngToGeoPoint';
import { mapGeoPointToLatLng } from '../../shared/mapGeoPointToLatLng';

interface GeoPoint {
  coords: {
    _lat: number;
    _long: number;
  }
}

@Injectable()
export class FirebaseService {
  stationList: Observable<LatLng[]>;
  userId: string;
  userDataRef;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {

    this.stationList = this.db.collection('stations').valueChanges().map(geopoints => {
      return geopoints.map(mapGeoPointToLatLng);
    });

    this.afAuth.idToken.subscribe(token => {
      this.userId = token;
    })
  }

  signInAnonymously() {
    return this.afAuth.auth.signInAnonymously().then((result) => {
      this.userId = result.uid;
      this.userDataRef = this.db.collection('users').doc(this.userId);
    });
  }

  // TODO: create nested searchParams structure rather than flat properties? How do I update or make a reference?

  updateSearchOrigin(searchOrigin: LatLng) {

    this.userDataRef.update({ searchOrigin: mapLatLngToGeoPoint(searchOrigin) });
  }

  updateSearchDestination(searchDestination: LatLng) {
    this.userDataRef.update({ searchDestination: mapLatLngToGeoPoint(searchDestination) });
  }

  updateTimeTarget(searchTimeTarget: string) {
    this.userDataRef.update({ searchTimeTarget });
  }

  updateDatetime(date: string) {
    const searchDatetime = new Date(date);
    this.userDataRef.update({ searchDatetime })
  }

  // geopoint(latlng: LatLng) {
  //   return new firebase.firestore.GeoPoint(latlng.lat, latlng.lng);
  // }

}



