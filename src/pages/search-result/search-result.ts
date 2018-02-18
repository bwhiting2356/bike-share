import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Trip, tripA } from '../../../shared/Trip';

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

  get priceMessage() {
    if (this.trip.totalPrice > 0) {
      return 'Total earnings';
    } else {
      return 'Total cost';
    }
  }

  constructor(
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.trip = tripA;
  }

}
