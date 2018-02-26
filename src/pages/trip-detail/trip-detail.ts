import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Trip } from '../../../shared/Trip';
import { TempPage } from '../temp/temp';


@IonicPage()
@Component({
  selector: 'page-trip-detail',
  templateUrl: 'trip-detail.html',
})
export class TripDetailPage {
  trip: Trip;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip");
  }

  backToSearch() {
    this.navCtrl.push(TempPage);
  }

}
