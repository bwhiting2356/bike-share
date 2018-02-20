import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Trip, tripA } from '../../../shared/Trip';
import { bicyclePolylineMainColor, bicyclePolylineBorderColor } from '../../../shared/ThemeVariables';
import { FirebaseService } from '../../services/firebase-service';

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
  trip: Trip;
  bicyclePolylineMainColor;
  bicyclePolylineBorderColor;

  get priceMessage() {
    if (this.trip.totalPrice > 0) {
      return 'Total earnings';
    } else {
      return 'Total cost';
    }
  }

  get priceAbsValue() {
    return Math.abs(this.trip.totalPrice);
  }

  constructor(
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.firebaseService.searchResult.subscribe(result => {
      console.log(result);
      this.trip = new Trip(result);
    })

    // firebaseService.userDataRef
    //   .valueChanges().subscribe(values => {
    //     if (values && values.searchResult) {
    //       this.trip = new Trip(values.searchResult);
    //     } else {
    //       this.trip = null;
    //     }
    //     console.log(this.trip);
    // });
    this.bicyclePolylineMainColor = bicyclePolylineMainColor;
    this.bicyclePolylineBorderColor = bicyclePolylineBorderColor;
  }

}
