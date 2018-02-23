import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { LatLng } from '../../shared/LatLng';
import { mapLatLngToGeoPoint } from '../../shared/mapLatLngToGeoPoint';

import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class FirebaseService {
  stationList: Observable<LatLng[]>;
  searchResult: Observable<any>;
  userId: string;
  userDataRef;

  constructor(
    public afAuth: AngularFireAuth,
    private dbFirestore: AngularFirestore) {

    this.signInAnonymously().then(result => {
      this.userId = result.uid;
      this.userDataRef = this.dbFirestore.collection('/users').doc(this.userId);
      this.searchResult = this.userDataRef.valueChanges().map(data => data.searchResult);
    });

    this.stationList = this.dbFirestore.collection('/stations').valueChanges()
      .map(stationList => stationList.map(station => clientMapGeoPointToLatLng(station["coords"])));
  }

  signInAnonymously() {
    return this.afAuth.auth.signInAnonymously();
  }

  // search methods

  updateSearchOrigin(coords: LatLng, address: string) {
    const originCoords = mapLatLngToGeoPoint(coords);
    this.userDataRef
      .set({ searchParams: { origin: { coords: originCoords, address } }}, { merge: true });
  }

  updateSearchDestination(coords: LatLng, address: string) {
    const destinationCoords = mapLatLngToGeoPoint(coords);
    this.userDataRef
      .set({ searchParams: { destination: { coords: destinationCoords, address } }}, { merge: true });
  }

  updateTimeTarget(timeTarget: string) {
    this.userDataRef
      .set({ searchParams: { timeTarget }}, { merge: true });
  }

  updateDatetime(date: string) {
    const datetime = new Date(date);
    this.userDataRef
      .set({ searchParams: { datetime }}, { merge: true });
  }
}

export const clientMapGeoPointToLatLng = (geopoint): LatLng => { // TODO: save for when geoqueries come to firestore
  return { lat: geopoint.latitude, lng: geopoint.longitude };
};
