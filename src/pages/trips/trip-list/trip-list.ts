import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { fakeTrips, Trip } from "../../../../shared/Trip";

@IonicPage()
@Component({
  selector: 'page-trip-list',
  templateUrl: 'trip-list.html',
})
export class TripListPage {
  trips = fakeTrips;
  rootNav: any;

  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.rootNav = app.getRootNavById('n4'); // TODO: why is it n4?

  }

  onTripClicked(trip: Trip) {
    this.rootNav.push("TripDetailPage", { trip })
  }

}
