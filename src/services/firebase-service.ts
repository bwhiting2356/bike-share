import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from "rxjs/Observable";
import { LatLng } from '../shared/LatLng';

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
  searchParams;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {

    this.stationList = this.db.collection('stations').valueChanges().map((geopoints: GeoPoint[]) => {
      return geopoints.map(geopoint => {
        return { lat: geopoint.coords._lat, lng: geopoint.coords._long };
      })
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
    this.userDataRef.update({ searchOrigin });
  }

  updateSearchDestination(searchDestination: LatLng) {
    this.userDataRef.update({ searchDestination });
  }

  updateTimeTarget(searchTimeTarget: string) {
    this.userDataRef.update({ searchTimeTarget });
  }

  updateDatetime(date: string) {
    const searchDatetime = new Date(date);
    this.userDataRef.update({ searchDatetime })
  }
}
