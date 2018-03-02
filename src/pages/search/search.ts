import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';

// pages

import { AddressModalPage } from '../address-modal/address-modal';
import { SearchResultPage } from '../search-result/search-result';

// shared

import { LatLng } from '../../../shared/LatLng';
import { dateToISOStringLocal } from '../../../shared/dateToISOStringLocal';

// rxjs

import { Observable } from 'rxjs/Observable';

// services

import { FirebaseService } from '../../services/firebase-service';
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

  timeTarget: string = 'Depart at';
  datetime: string;

  fetching: boolean;

  constructor(
    private geolocationService: GeolocationService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.datetime = dateToISOStringLocal(new Date());
    this.userLocation$ = this.geolocationService.userLocation$;
    this.stationList = this.firestoreService.stationList;

    // display toast if there is one
    if (this.navParams.get("toast")) {
      toastCtrl.create({
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

  openOriginModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Origin" });
    modal.present();
    modal.onDidDismiss((address) => {
      if (address) {
        this.fetching = true;
        if (address === CURRENT_LOCATION) {
          this.originAddress = CURRENT_LOCATION;
          this.userLocation$.take(1).subscribe(latlng => {
            this.fetching = false;
            this.originCoords = latlng;
            this.firestoreService.updateSearchOrigin(latlng, CURRENT_LOCATION);
          })
        } else {
          this.originAddress = address;
          this.geolocationService.geocode(address).then(latlng => {
            this.fetching = false;
            this.originCoords = latlng;
            this.firestoreService.updateSearchOrigin(latlng, address);
          });
        }
      }

      // TODO; maybe add a spinner while we're waiting for the geolocation to come back from the server
    });
  }

  openDestinationModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Destination"});
    modal.present();
    modal.onDidDismiss((address) => {
      if (address) {
        this.fetching = true;
        if (address === CURRENT_LOCATION) {
          this.destinationAddress = CURRENT_LOCATION;
          this.userLocation$.take(1).subscribe(latlng => {
            this.fetching = false;
            this.destinationCoords = latlng;
            this.firestoreService.updateSearchDestination(latlng, CURRENT_LOCATION);
          })
        } else {
          this.destinationAddress = address;
          this.geolocationService.geocode(address).then(latlng => {
            this.fetching = false;
            this.destinationCoords = latlng;
            this.firestoreService.updateSearchDestination(latlng, address);
          });
        }
      }
    });
  }

  // TODO: on dismiss, add spinner to map while we're waiting for the results of the geocoding

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
