import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
  // animations: [
  //   trigger('pastListPosition', [
  //     state('left', style({transform: 'translateX(-100%)'})),
  //     state('center', style({transform: 'translateX(0)'})),
  //     transition('void => *', [
  //       style({transform: 'translateX(-100%)'}),
  //       animate(1000)
  //     ]),
  //     transition('* => void', [
  //       animate(1000, style({transform: 'translateX(-100%)'}))
  //     ])
  //   ]),
  //   trigger('upcomingListPosition', [
  //     state('right', style({transform: 'translateX(100%)'})),
  //     state('center', style({transform: 'translateX(0)'})),
  //     transition('void => *', [
  //       style({transform: 'translateX(100%)'}),
  //       animate(1000)
  //     ]),
  //     transition('* => void', [
  //       animate(1000, style({transform: 'translateX(-100%)'}))
  //     ]),
  //   ])
  // ]  TODO: fix animations
})
export class TripsPage {
  trips: Trip[];
  pastTrips: Trip[];
  upcomingTrips: Trip[];
  timeDirection: string = 'upcoming';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trips = fakeTrips;
    this.pastTrips = this.trips.filter(trip => {
      return trip.data.status === TripStatus.COMPLETED  // order
    });
    this.upcomingTrips = this.trips.filter(trip => {
      return trip.data.status === TripStatus.COMPLETED // change this to SCHEDULED, also order
    });
  }

  get pastListPosition() {
    return this.timeDirection === 'past' ? 'center' : 'right';
  }

  get upcomingListPosition() {
    return this.timeDirection === 'upcoming' ? 'center' : 'left';
  }

  onTripClicked(trip: Trip) {
    this.navCtrl.push(TripDetailPage, { trip })
  }

}
