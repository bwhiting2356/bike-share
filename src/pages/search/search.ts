import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

// pages

import { SearchResultPage } from '../search-result/search-result';

// shared

import { LatLng } from '../../../shared/LatLng';
import { dateToISOStringLocal } from '../../../shared/dateToISOStringLocal';

// rxjs

import { Observable } from 'rxjs/Observable';

// services

import { GeolocationService } from '../../services/geolocation-service';
import { AuthService } from '../../services/auth-service';
import { FirestoreService } from '../../services/firestore-service';

const CURRENT_LOCATION = "Current Location";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  userLocation$: Observable<LatLng>;

  center;
  stationList: Observable<LatLng[]>;

  originAddress: string;
  originCoords: LatLng;
  destinationAddress: string;
  destinationCoords: LatLng;

  showCurrentLocation;
  showAutocomplete: string;

  timeTarget: string = 'Depart at';
  datetime: string;

  fetching: boolean;

  constructor(
    private geolocationService: GeolocationService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
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

    this.showCurrentLocation = this.geolocationService.foundPosition;

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

  originAddressChange(address: string) {
    this.originAddress = address;
    if (address === CURRENT_LOCATION) {
      this.geolocationService.userLocation$.take(1).subscribe((latlng: LatLng) => {
        this.originCoords = latlng;
        this.firestoreService.updateSearchOrigin(latlng, address);
      });
    } else {
      this.geolocationService.geocode(address).then(latlng => {
        this.originCoords = latlng;
        this.firestoreService.updateSearchOrigin(latlng, address);
      });
    }
  }

  destinationAddressChange(address: string) {
    this.destinationAddress = address;

    if (address === CURRENT_LOCATION) {
      this.geolocationService.userLocation$.take(1).subscribe((latlng: LatLng) => {
        this.destinationCoords = latlng;
        this.firestoreService.updateSearchDestination(latlng, address);
      });
    } else {
      this.geolocationService.geocode(address).then(latlng => {
        this.destinationCoords = latlng;
        this.firestoreService.updateSearchDestination(latlng, address);
      });
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
