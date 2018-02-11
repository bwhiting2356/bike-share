import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { LatLng } from '../../shared/LatLng';
import 'rxjs/add/operator/startWith';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AddressModalPage } from '../address-modal/address-modal';
import { Observable } from 'rxjs/Observable';

import { FirebaseService } from '../../services/firebase-service';
import { GeolocationService } from '../../services/geolocation-service';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  center;
  origin: string;
  originCoords: BehaviorSubject<LatLng>;
  destination: string;
  destinationCoords: BehaviorSubject<LatLng>;
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
    this.originCoords = new BehaviorSubject(null);
    this.destinationCoords = new BehaviorSubject(null);
    this.geolocationService.getCurrentPosition();
    this.center = this.geolocationService.userLocation$;
    this.stationList = this.firebaseService.stationList;
  }

  ionViewDidLoad() {
    this.geolocationService.getCurrentPosition();
    this.firebaseService.signInAnonymously().then(() => {
      this.timeTargetChange();
    })

  }

  openOriginModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Origin" });
    modal.present();
    modal.onDidDismiss((choice) => {
      if (choice) {
        this.origin = choice;
        this.geolocationService.geocode(choice).then(latlng => {
          this.originCoords.next(latlng);
          this.firebaseService.updateSearchOrigin(latlng);
        });
      }
      // TODO; maybe add a spinner while we're waiting for the geolocation to come back from the server
    });
  }

  openDestinationModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Destination"});
    modal.present();
    modal.onDidDismiss((choice) => {
      if (choice) {
        this.destination = choice;
        this.geolocationService.geocode(choice).then(latlng => {
          this.destinationCoords.next(latlng);
          this.firebaseService.updateSearchDestination(latlng);
        });
      }
    });
  }

  get disableButton() {
    return !this.origin || !this.destination;
  }

  timeTargetChange() {
    this.firebaseService.updateTimeTarget(this.timeTarget);
  }

  datetimeChange() {
    this.firebaseService.updateDatetime(this.datetime);

  }
}
