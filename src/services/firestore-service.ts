import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from '@angular/common/http';

// firebase

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentData } from "@firebase/firestore-types";

// shared

import { LatLng } from '../../shared/LatLng';
import { TripData } from '../../shared/Trip';
import { mapLatLngToGeoPoint } from '../../shared/mapLatLngToGeoPoint';


import 'rxjs/add/operator/take';

import { AuthService } from "./auth-service";


@Injectable()
export class FirestoreService {
  stationList: Observable<LatLng[]>;
  userId: string;
  userDataRef: AngularFirestoreDocument<DocumentData>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dbFirestore: AngularFirestore) {

    this.stationList = this.dbFirestore.collection('/stations').valueChanges()
      .map(stationList => stationList.map(station => clientMapGeoPointToLatLng(station["coords"])));

    this.authService.currentUserIdObservable.subscribe(userId => {
      if (userId) {
        this.userId = userId;
        this.userDataRef = this.dbFirestore.collection('/users').doc(userId);
      }
    });
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
