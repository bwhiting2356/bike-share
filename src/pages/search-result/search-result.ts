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

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  origin: LatLng;
  destination: LatLng;
  trip: Trip;
  tripData: TripData;
  error: string;
  fetching: boolean;
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
  ) { }

  ionViewWillEnter() {
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');

    this.fetching = true;

    this.subscription = this.firestoreService.searchResult.subscribe((response) => {
      if (response) {
        if (response.error) {
          this.trip = null;
          this.tripData = null;
          this.error = response.error;
          this.fetching = false;
        } else {
          this.trip = new Trip(response.tripData);
          this.tripData = response.tripData;
          this.error = null;
          this.fetching = false;
        }
      } else {
        this.trip = null;
        this.tripData = null;
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.error = null;
    this.trip = null;
    this.tripData = null;
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
        this.firestoreService.bookReservation(this.tripData);
        this.navCtrl.push(TempPage);
      }
    })


  }

}
