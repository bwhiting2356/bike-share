import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import { LatLng } from '../../shared/LatLng';
import { mapLatLngToGeoPoint } from '../../shared/mapLatLngToGeoPoint';

import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';
import { TripData } from '../../shared/Trip';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import { environment } from '../environments/environment';
import { AuthService } from "./auth-service";


@Injectable()
export class FirebaseService {
  stationList: Observable<LatLng[]>;
  searchResult: Observable<any>;
  userId: string;
  user: Observable<firebase.User>;
  isAnonymous: Observable<boolean>;

  constructor(
    private gplus: GooglePlus,
    private platform: Platform,
    private http: HttpClient,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private dbFirestore: AngularFirestore) {

    this.user = this.afAuth.authState;

    this.stationList = this.dbFirestore.collection('/stations').valueChanges()
      .map(stationList => stationList.map(station => clientMapGeoPointToLatLng(station["coords"])));
  }

  // auth

  get userDataRef() {
    return this.dbFirestore.collection('/users').doc(this.userId);
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

  bookReservation(tripData: TripData) {
    console.log("trip data: ", tripData);

    this.http.post('https://us-central1-bike-share-1517478720061.cloudfunctions.net/bookTrip  ',
      { userId: this.userId, tripData })
      .subscribe(result => console.log(result));
    // TODO: book reservation

  }
}

export const clientMapGeoPointToLatLng = (geopoint): LatLng => { // TODO: save for when geoqueries come to firestore
  return { lat: geopoint.latitude, lng: geopoint.longitude };
};
