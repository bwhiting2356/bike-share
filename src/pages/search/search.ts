import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

// pages

import { SearchResultPage } from '../search-result/search-result';

// shared

import { LatLng } from '../../../shared/LatLng';
import { TimeTarget } from '../../../shared/TimeTarget';
import { dateToISOStringLocal } from '../../../shared/dateToISOStringLocal';

// rxjs

import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

// providers

import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { AuthProvider } from '../../providers/auth/auth';

const CURRENT_LOCATION = "Current Location";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  userLocation$: Observable<LatLng | undefined>;

  center: LatLng;
  stationList: Observable<LatLng[]>;

  originAddress: string;
  originCoords: LatLng;
  destinationAddress: string;
  destinationCoords: LatLng;

  showAutocomplete: 'origin' | 'destination';

  timeTarget: TimeTarget = 'Depart at';
  datetime: string;

  // fetching: boolean;

  constructor(
    private geolocationService: GeolocationProvider,
    private authService: AuthProvider,
    private firestoreService: FirestoreProvider,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.datetime = dateToISOStringLocal(new Date());
    this.userLocation$ = this.geolocationService.userLocation$;

    this.stationList = this.firestoreService.stationList;

    // display toast if there is one
    if (this.navParams.get("toast")) {
      this.toastCtrl.create({
        message: this.navParams.get("toast"),
        duration: 3000,
        position: 'bottom'
      }).present();
    }

    // get origin and destination from nav params, if they're there
    this.originCoords = this.navParams.get('origin') ? this.navParams.get('origin').coords : null;
    this.originAddress = this.navParams.get('origin') ? this.navParams.get('origin').address : null;
    this.destinationCoords = this.navParams.get('destination') ? this.navParams.get('destination').coords : null;
    this.destinationAddress = this.navParams.get('destination') ? this.navParams.get('destination').address : null;
  }

  ionViewDidLoad() {
    this.authService.currentUserIdObservable.subscribe(token => {
      if (token) {
        this.timeTargetChange();
        this.datetimeChange();
      }
    });

  } // TODO: this might break something later if they sign in for real and it changes their search params

  originFocused() {
    this.showAutocomplete = 'origin';
  }

  destinationFocused() {
    this.showAutocomplete = 'destination';
  }

  async originAddressChange(address: string) {
    this.originAddress = address;
    let latlng: LatLng | undefined | null; // TODO: fix

    if (address === CURRENT_LOCATION) {
      latlng = await this.geolocationService.userLocation$
        .pipe(
          take(1),
        ).toPromise()
    } else {
      latlng = await this.geolocationService.geocode(address);
    }

    if (latlng) {
      this.originCoords = latlng;
      this.firestoreService.updateSearchOrigin(latlng, address);
    }
  }

  async destinationAddressChange(address: string) {
    this.destinationAddress = address;
    let latlng: LatLng | undefined | null; // TODO: fix

    if (address === CURRENT_LOCATION) {
      latlng = await this.geolocationService.userLocation$
        .pipe(
          take(1)
        ).toPromise();
    } else {
      latlng = await this.geolocationService.geocode(address)
    }

    if (latlng) {
      this.destinationCoords = latlng;
      this.firestoreService.updateSearchDestination(latlng, address);
    }
  }

  get disableButton() {
    return !this.originAddress || !this.destinationAddress;
  }

  timeTargetChange() {
    this.firestoreService.updateTimeTarget(this.timeTarget);
  }

  datetimeChange() {
    this.firestoreService.updateDatetime(this.datetime);
  }

  seeResults() {
    this.navCtrl.push(SearchResultPage, {origin: this.originCoords, destination: this.destinationCoords });
  }
}
