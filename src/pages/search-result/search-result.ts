import { Component, OnDestroy } from '@angular/core';
import {
  ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import { Trip } from '../../../shared/Trip';
import { LatLng } from '../../../shared/LatLng';
import { TempPage } from '../temp/temp';
import { LoginModalPage } from '../login-modal/login-modal';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { AuthProvider } from '../../providers/auth/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage implements OnDestroy {
  origin: LatLng;
  destination: LatLng;
  result: Trip;
  error: BehaviorSubject<string>;
  fetching: BehaviorSubject<boolean>;
  bicyclePolylineMainColor;
  bicyclePolylineBorderColor;
  tripSubscription;

  collapsed: boolean = false;

  constructor(
    private authService: AuthProvider,
    private firestoreService: FirestoreProvider,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.fetching = this.firestoreService.searchFetching;
    this.error = this.firestoreService.searchError;

    this.tripSubscription = this.firestoreService.searchResultTrip.subscribe(result => {
      this.result = result;
    })
  }

  ionViewWillEnter() {
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');
  }

  ngOnDestroy() {
    this.tripSubscription.unsubscribe();
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  bookReservation() {
    this.authService.isAnonymous()
      .pipe(
        take(1)
      )
      .subscribe(anon => {
      if (anon) {
        const loginModal = this.modalCtrl.create(LoginModalPage);
        loginModal.present();
        loginModal.onDidDismiss(toast => {
          if (toast) {
            this.toastCtrl.create({
              message: toast,
              duration: 3000,
              position: 'bottom'
            }).present();
          } // TODO: this breaks the search when they sign in because it clears search params
        })
      } else {
        // this.firestoreService.bookReservation();
        // this.navCtrl.push(TempPage);
      }
    })
  }
}
