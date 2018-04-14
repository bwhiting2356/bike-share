import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from '@angular/common/http';

// firebase

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentData } from "@firebase/firestore-types";

// shared

import { LatLng } from '../../../shared/LatLng';
import { TimeTarget } from '../../../shared/TimeTarget';
import { Trip, TripData } from '../../../shared/Trip';
import { mapLatLngToGeoPoint } from '../../../shared/mapLatLngToGeoPoint';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { clientMapGeoPointToLatLng } from './clientMapGeoPointToLatLng';
import { map, take } from 'rxjs/operators';
import { AuthProvider } from '../auth/auth';


@Injectable()
export class FirestoreProvider {
  stationList: Observable<any[]>;
  userId: string | undefined;
  userDataRef: AngularFirestoreDocument<DocumentData> | undefined;
  searchResultTrip: BehaviorSubject<Trip | null>;
  searchError: BehaviorSubject<string | null>;
  searchFetching: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private authService: AuthProvider,
    private dbFirestore: AngularFirestore) {

    this.searchResultTrip = new BehaviorSubject<Trip | null>(null);
    this.searchError = new BehaviorSubject<string | null>(null);
    this.searchFetching = new BehaviorSubject<boolean>(true);

    this.stationList = this.dbFirestore.collection('/stations').valueChanges()
      .pipe(
        take(1),
        // map(stationList => stationList.map((station: any) => clientMapGeoPointToLatLng(station["coords"])))
      );

    this.authService.currentUserIdObservable.subscribe(userId => {
      if (userId) {
        this.userId = userId;
        this.userDataRef = this.dbFirestore.collection('/users').doc(userId);
        this.userDataRef.valueChanges().subscribe(data => {
          if (data) {
            if (data.searchResult && data.searchResult.tripData) {
              this.searchResultTrip.next(new Trip(data.searchResult.tripData));
              this.searchError.next(null);
              this.searchFetching.next(false);
            }
            if (data.searchResult && data.searchResult.error) {
              this.searchError.next(data.searchResult.error);
              this.searchResultTrip.next(null);
              this.searchFetching.next(false);
            }
          }
        });
      }
    }); // TODO: this is a gnarly mess
  }

  // search methods

  updateSearchOrigin(coords: LatLng, address: string) {
    this.updateSearchParams();
    const originCoords = mapLatLngToGeoPoint(coords);
    if (this.userDataRef) {
      this.userDataRef
        .set({ searchParams: { origin: { coords: originCoords, address } }}, { merge: true });
    }
  }

  updateSearchDestination(coords: LatLng, address: string) {
    this.updateSearchParams();
    const destinationCoords = mapLatLngToGeoPoint(coords);
    if (this.userDataRef) {
      this.userDataRef
        .set({ searchParams: { destination: { coords: destinationCoords, address } }}, { merge: true });
    }
  }

  updateTimeTarget(timeTarget: TimeTarget) {
    this.updateSearchParams();
    if (this.userDataRef) {
      this.userDataRef
        .set({ searchParams: { timeTarget }}, { merge: true });
    }
  }

  updateDatetime(date: string) {
    this.updateSearchParams();
    const datetime = new Date(date);
    if (this.userDataRef) {
      this.userDataRef
        .set({ searchParams: { datetime }}, { merge: true });
    }
  }

  bookReservation(tripData: TripData) {
    this.http.post('https://us-central1-bike-share-1517478720061.cloudfunctions.net/bookTrip  ',
      { userId: this.userId, tripData })
      .subscribe(result => console.log(result));
    // TODO: book reservation
  }

  // search results
  updateSearchParams() {
    // reset fields while a new search is starting
    this.searchFetching.next(true);
    this.searchResultTrip.next(null);
    this.searchError.next(null);
  }
}

