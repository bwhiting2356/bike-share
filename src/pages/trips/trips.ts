import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TripDetailPage } from '../trip-detail/trip-detail';
import { fakeTrips, Trip, TripStatus } from '../../../shared/Trip';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trips',
  templateUrl: 'trips.html',
})
export class TripsPage {
  trips: Trip[];
  pastTrips: Trip[];
  upcomingTrips: Trip[];
  timeDirection: string = 'past';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trips = fakeTrips;
    this.pastTrips = this.trips.filter(trip => {
      return trip.data.status === TripStatus.COMPLETED
    });
    this.upcomingTrips = this.trips.filter(trip => {
      return trip.data.status === TripStatus.SCHEDULED
    });
    console.log(this.pastTrips);
    console.log(this.upcomingTrips);
  }

  onTripClicked(trip: Trip) {
    this.navCtrl.push(TripDetailPage, { trip })
  }

}
