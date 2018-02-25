import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Trip, TripData } from '../../../shared/Trip';
import { bicyclePolylineMainColor, bicyclePolylineBorderColor } from '../../../shared/ThemeVariables';
import { FirebaseService } from '../../services/firebase-service';
import { LatLng } from '../../../shared/LatLng';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  origin: LatLng;
  destination: LatLng;
  trip: Trip;
  error: string;
  fetching: boolean;
  bicyclePolylineMainColor;
  bicyclePolylineBorderColor;
  subscription;

  // get priceMessage() {
  //   this.trip.take(1).subscribe(t => {
  //     if (t) {
  //       if (t.totalPrice > 0) {
  //         return 'Total earnings';
  //       } else {
  //         return 'Total cost';
  //       }
  //     } else {
  //       return null;
  //     }
  //   })
  // }

  // get priceAbsValue() {
  //   return Math.abs(this.trip.totalPrice);
  // }

  constructor(
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams
  ) {
    //
    // this.origin = this.navParams.get('origin');
    // this.destination = this.navParams.get('destination');
    //
    // this.fetching = true;
    //
    // this.firebaseService.searchResult.subscribe((response) => {
    //   if (response) {
    //     console.log('response: ', response);
    //     if (response.error) {
    //       this.trip = null;
    //       this.error = response.error;
    //       this.fetching = false;
    //     } else {
    //       this.trip = new Trip(response);
    //       this.error = null;
    //       this.fetching = false;
    //     }
    //   } else {
    //     this.trip = null;
    //   }
    // });
    //
    // this.bicyclePolylineMainColor = bicyclePolylineMainColor;
    // this.bicyclePolylineBorderColor = bicyclePolylineBorderColor;
  }

  ionViewWillEnter() {
    console.log("Ion view will enter");
    this.origin = this.navParams.get('origin');
    this.destination = this.navParams.get('destination');

    this.fetching = true;

    this.subscription = this.firebaseService.searchResult.subscribe((response) => {
      if (response) {
        console.log('response: ', response);
        if (response.error) {
          this.trip = null;
          this.error = response.error;
          this.fetching = false;
        } else {
          this.trip = new Trip(response);
          console.log("this.trip: ", this.trip);
          this.error = null;
          this.fetching = false;
        }
      } else {
        this.trip = null;
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
