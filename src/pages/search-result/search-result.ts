import { Component } from '@angular/core';
import {
  IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import { Trip, TripData } from '../../../shared/Trip';
import { LatLng } from '../../../shared/LatLng';
import { TempPage } from '../temp/temp';
import { FirestoreService } from '../../services/firestore-service';
import { AuthService } from '../../services/auth-service';
import { LoginModalPage } from '../login-modal/login-modal';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  origin: LatLng;
  destination: LatLng;
  result: BehaviorSubject<Trip>;
  // tripData: TripData;
  error: BehaviorSubject<string>;
  fetching: BehaviorSubject<boolean>;
  bicyclePolylineMainColor;
  bicyclePolylineBorderColor;
  subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams
  ) {
    this.fetching = this.firestoreService.searchFetching;
    this.result = this.firestoreService.searchResultTrip;
    this.error = this.firestoreService.searchError;
  }

  ionViewWillEnter() {
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');
  }

  bookReservation() {
    this.authService.isAnonymous().take(1).subscribe(anon => {
      if (anon) {
        const loginModal = this.modalCtrl.create(LoginModalPage);
        loginModal.present();
        loginModal.onDidDismiss(() => {
          this.toastCtrl.create({
            message: "Logged in successfully",
            duration: 3000,
            position: 'bottom'
          }).present();
        })
      } else {
        // this.firestoreService.bookReservation();
        this.navCtrl.push(TempPage);
      }
    })
  }
}
