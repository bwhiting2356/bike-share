import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Trip, TripData } from '../../../shared/Trip';
import { FirebaseService } from '../../services/firebase-service';
import { LatLng } from '../../../shared/LatLng';
import { TempPage } from '../temp/temp';

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
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams
  ) {

  }

  ionViewWillEnter() {
    console.log("Ion view will enter");
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');

    this.fetching = true;

    this.subscription = this.firebaseService.searchResult.subscribe((response) => {
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
    console.log("ion will leave called");
    this.subscription.unsubscribe();
    this.error = null;
    this.trip = null;
    this.tripData = null;
  }

  bookReservation() {
    this.firebaseService.bookReservation(this.tripData);
    this.navCtrl.push(TempPage);
  }

}
