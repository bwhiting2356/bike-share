import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Trip } from '../../../shared/Trip';
import { SearchPage } from '../search/search';


@IonicPage()
@Component({
  selector: 'page-trip-detail',
  templateUrl: 'trip-detail.html',
})
export class TripDetailPage {
  trip: Trip;
  collapsed: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip");
  }

  backToSearch() {
    this.navCtrl.setRoot(SearchPage,
      { origin: this.trip.origin, destination: this.trip.destination },
      { animate: true }
      );
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

}
