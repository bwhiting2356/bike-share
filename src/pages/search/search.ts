import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

// pages

import { AddressModalPage } from '../address-modal/address-modal';
import { SearchResultPage } from '../search-result/search-result';

// shared

import { LatLng } from '../../../shared/LatLng';

// rxjs

import 'rxjs/add/operator/startWith';
import { Observable } from 'rxjs/Observable';

// services

import { FirebaseService } from '../../services/firebase-service';
import { GeolocationService } from '../../services/geolocation-service';


// TODO: rename this page to 'search' with a magnfifying glass icon'

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  center;
  origin: string;
  originCoords: LatLng;
  destination: string;
  destinationCoords: LatLng;
  stationList: Observable<LatLng[]>;
  timeTarget: string = 'Depart at';
  datetime;

  constructor(
    private modalCtrl: ModalController,
    private geolocationService: GeolocationService,
    private firebaseService: FirebaseService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.datetime = new Date().toISOString();
    // this.originCoords = new BehaviorSubject(null);
    // this.destinationCoords = new BehaviorSubject(null);
    this.geolocationService.getCurrentPosition();
    this.center = this.geolocationService.userLocation$;
    this.stationList = this.firebaseService.stationList;
  }

  ionViewDidLoad() {
    this.geolocationService.getCurrentPosition();
    this.firebaseService.signInAnonymously().then(() => {
      this.timeTargetChange();
      this.datetimeChange();
    })

  }

  openOriginModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Origin" });
    modal.present();
    modal.onDidDismiss((address) => {
      if (address) {
        this.origin = address;
        this.geolocationService.geocode(address).then(latlng => {
          this.originCoords = latlng;
          this.firebaseService.updateSearchOrigin(latlng, address);
        });
      }
      // TODO; maybe add a spinner while we're waiting for the geolocation to come back from the server
    });
  }

  openDestinationModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Destination"});
    modal.present();
    modal.onDidDismiss((address) => {
      if (address) {
        this.destination = address;
        this.geolocationService.geocode(address).then(latlng => {
          this.destinationCoords = latlng;
          this.firebaseService.updateSearchDestination(latlng, address);
        });
      }
    });
  }

  // TODO: on dismiss, add spinner to map while we're waiting for the results of the geocoding

  get disableButton() {
    return !this.origin || !this.destination;
  }

  timeTargetChange() {
    this.firebaseService.updateTimeTarget(this.timeTarget);
  }

  datetimeChange() {
    this.firebaseService.updateDatetime(this.datetime);
  }

  submitSearch() {
    let searchQuery = {
      origin: {
        coords: this.originCoords,
        address: this.origin
      },
      destination: {
        coords: this.destinationCoords,
        address: this.destination
      },
      timeTarget: this.timeTarget,
      datetime: this.datetime
    };

    this.navCtrl.push(SearchResultPage, { searchQuery });
  }
}
