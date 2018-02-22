import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

// pages

import { AddressModalPage } from '../address-modal/address-modal';
import { SearchResultPage } from '../search-result/search-result';

// shared

import { LatLng } from '../../../shared/LatLng';

// rxjs

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/forkJoin';
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
  origin: string;

  originCoords: LatLng;
  destination: string;
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
    this.datetime = new Date().toISOString();
    this.userLocation$ = this.geolocationService.userLocation$;
    this.stationList = this.firebaseService.stationList;
    // this.stationList.subscribe(stations => {
    //   console.log("line 58 statino list: ", stations);
    //   }
    // )

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
          this.origin = CURRENT_LOCATION;
          this.userLocation$.take(1).subscribe(latlng => {
            this.fetching = false;
            this.originCoords = latlng;
            this.firebaseService.updateSearchOrigin(latlng, CURRENT_LOCATION);
          })
        } else {
          this.origin = address;
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
          this.destination = CURRENT_LOCATION;
          this.userLocation$.take(1).subscribe(latlng => {
            this.fetching = false;
            this.destinationCoords = latlng;
            this.firebaseService.updateSearchDestination(latlng, CURRENT_LOCATION);
          })
        } else {
          this.destination = address;
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
