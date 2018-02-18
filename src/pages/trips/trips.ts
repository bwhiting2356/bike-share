import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { fakeTrips, Trip, TripStatus } from './fakeTrips'
import { TripDetailPage } from '../trip-detail/trip-detail';

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
  currentTrips: Trip[];
  trips: Trip[];
  timeDirection: string = 'upcoming';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trips = fakeTrips;
  }

  timeDirectionChange() {
    if (this.timeDirection === 'upcoming') {
      this.currentTrips = this.trips.filter(trip => {
        return trip.data.status === TripStatus.SCHEDULED
      })

    } else {
      this.currentTrips = this.trips.filter(trip => {
        return trip.data.status !== TripStatus.SCHEDULED
      })

    }
  }

  onTripClicked(trip: Trip) {
    this.navCtrl.push(TripDetailPage, { trip })
  }

}
