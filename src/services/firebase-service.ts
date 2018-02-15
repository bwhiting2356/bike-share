import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { LatLng } from '../../shared/LatLng';
import { mapLatLngToGeoPoint } from '../../shared/mapLatLngToGeoPoint';
import { mapGeoPointToLatLng } from '../../shared/mapGeoPointToLatLng';

import 'rxjs/add/operator/take';



@Injectable()
export class FirebaseService {
  stationList: Observable<LatLng[]>;
  userId: string;
  userDataRef;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {

    this.stationList = this.db.collection('stations').valueChanges().map(geopoints => {
      return geopoints.map(clientMapGeoPointToLatLng);
    });

    this.afAuth.idToken.subscribe(token => {
      this.userId = token;
    });
  }

  signInAnonymously() {
    return this.afAuth.auth.signInAnonymously().then((result) => {
      this.userId = result.uid;
      this.userDataRef = this.db.collection('/users').doc(this.userId);
      // console.log(result);
      // return this.db.doc(`/users/${this.userId}`)
      //   .update({lastLogin: new Date()})
      //   .catch((error) => {
      //     console.log(error);
      //     return this.db.doc(`/users/${this.userId}`).set({lastLogin: new Date()})
      //   })
      // this.userDataRef = this.db.collection('/users').doc(this.userId);
    });
  }

  // TODO: create nested searchParams structure rather than flat properties? How do I update or make a reference?

  updateSearchOrigin(latlng: LatLng) {
    const searchOrigin = mapLatLngToGeoPoint(latlng);
    this.userDataRef
      .update({ searchOrigin })
      .catch(error => {
        this.userDataRef.set({ searchOrigin })
      });
  }

  updateSearchDestination(latlng: LatLng) {
    const searchDestination = mapLatLngToGeoPoint(latlng);
    this.userDataRef
      .update({ searchDestination })
      .catch(error => {
        this.userDataRef.set({ searchDestination })
      });
  }

  updateTimeTarget(searchTimeTarget: string) {
    this.userDataRef
      .update({ searchTimeTarget })
      .catch(error => {
        this.userDataRef.set({ searchTimeTarget })
      });
  }

  updateDatetime(date: string) {
    const searchDatetime = new Date(date);
    this.userDataRef
      .update({ searchDatetime })
      .catch(error => {
        this.userDataRef.set({ searchDatetime })
      })
  }
}

export const clientMapGeoPointToLatLng = (geopoint): LatLng => {
  return { lat: geopoint.coords.latitude, lng: geopoint.coords.longitude };
};




