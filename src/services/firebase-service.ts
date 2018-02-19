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
    return this.afAuth.auth.signInAnonymously().then(result => {
      this.userId = result.uid;
      this.userDataRef = this.db.collection('/users').doc(this.userId);
    });
  }

  // TODO: create nested searchParams structure rather than flat properties? How do I update or make a reference?

  updateSearchOrigin(coords: LatLng, address: string) {
    const searchOrigin = mapLatLngToGeoPoint(coords);
    this.userDataRef
      .update({ searchOrigin: { coords: searchOrigin, address } })
      .catch(err => {
        this.userDataRef.set({ searchDestination: { coords: searchOrigin, address } })
      })
  }

  // TODO: nest the search params inside of an object (also change on the backend)

  updateSearchDestination(coords: LatLng, address: string) {
    const searchDestination = mapLatLngToGeoPoint(coords);
    this.userDataRef
      .update({ searchDestination: { coords: searchDestination, address } })
      .catch(err => {
        this.userDataRef.set({ searchDestination: { coords: searchDestination, address } })
      })
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




