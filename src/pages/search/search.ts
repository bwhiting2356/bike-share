import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

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

const CURRENT_LOCATION = "Current Location";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  userLocation$: Observable<LatLng>;

  center;
  originAddress: string;

  originCoords: LatLng;
  destinationAddress: string;
  destinationCoords: LatLng;
  stationList: Observable<LatLng[]>;
  timeTarget: string = 'Depart at';
  datetime;

  fetching: boolean;

  constructor(
    private modalCtrl: ModalController,
    private geolocationService: GeolocationService,
    private firebaseService: FirebaseService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.datetime = dateToISOStringLocal(new Date());
    this.userLocation$ = this.geolocationService.userLocation$;
    this.stationList = this.firebaseService.stationList;
    this.originCoords = this.navParams.get('origin').coords;
    this.originAddress = this.navParams.get('origin').address;
    this.destinationCoords = this.navParams.get('destination').coords;
    this.destinationAddress = this.navParams.get('destination').address;

  }

  ionViewDidLoad() {
    this.firebaseService.afAuth.idToken.subscribe((token) => {
      if (token) {
        this.timeTargetChange();
        this.datetimeChange();
      }
    })
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
            this.firebaseService.updateSearchOrigin(latlng, CURRENT_LOCATION);
          })
        } else {
          this.originAddress = address;
          this.geolocationService.geocode(address).then(latlng => {
            this.fetching = false;
            this.originCoords = latlng;
            this.firebaseService.updateSearchOrigin(latlng, address);
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
            this.firebaseService.updateSearchDestination(latlng, CURRENT_LOCATION);
          })
        } else {
          this.destinationAddress = address;
          this.geolocationService.geocode(address).then(latlng => {
            this.fetching = false;
            this.destinationCoords = latlng;
            this.firebaseService.updateSearchDestination(latlng, address);
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
    this.firebaseService.updateTimeTarget(this.timeTarget);
  }

  datetimeChange() {
    this.firebaseService.updateDatetime(this.datetime);
  }

  seeResults() {
    this.navCtrl.push(SearchResultPage, {origin: this.originCoords, destination: this.destinationCoords });
  }
}
