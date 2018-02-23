import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';

import { LatLng } from '../../shared/LatLng';
import { mapLatLngToGeoPoint } from '../../shared/mapLatLngToGeoPoint';

import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';
import { SearchQuery } from '../../shared/SearchQuery';


@Injectable()
export class FirebaseService {
  stationList: Observable<LatLng[]>;
  searchResult: Observable<any>;
  userId: string;
  userDataRef;

  constructor(
    private http: HttpClient,

    public afAuth: AngularFireAuth,
    private dbFirestore: AngularFirestore,
    private dbDatabase: AngularFireDatabase) {

    this.signInAnonymously();

    this.stationList = this.dbDatabase.list('/stations').valueChanges()
      .map(stationList => stationList.map(station => station["coords"]));

    this.afAuth.idToken.subscribe(token => {
      this.userId = token;
    });
  }

  signInAnonymously() {
    return this.afAuth.auth.signInAnonymously().then(result => {
      this.userId = result.uid;
      this.userDataRef = this.dbFirestore.collection('/users').doc(this.userId);
    });
  }

  // TODO: create nested searchParams structure rather than flat properties? How do I update or make a reference?

  updateSearchOrigin(coords: LatLng, address: string) {
    const originCoords = mapLatLngToGeoPoint(coords);
    this.userDataRef
      .set({ searchParams: { origin: { coords: originCoords, address } }}, { merge: true });
  }

  // TODO: nest the search params inside of an object (also change on the backend)

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

  search(searchQuery: SearchQuery) {
    return this.http.post('https://us-central1-bike-share-1517478720061.cloudfunctions.net/searchBikeTrips', searchQuery)
  }
}

export const clientMapGeoPointToLatLng = (geopoint): LatLng => { // TODO: save for when geoqueries come to firestore
  return { lat: geopoint.coords.latitude, lng: geopoint.coords.longitude };
};
