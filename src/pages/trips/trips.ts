import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import { TripDetailPage } from '../trip-detail/trip-detail';
import { fakeTrips, Trip, TripStatus } from '../../../shared/Trip';
import { TripListPage } from "../trip-list/trip-list";
import { StatsPage } from "../stats/stats";

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

  upcomingPage = TripListPage;
  pastPage = TripListPage;
  statsPage = StatsPage;

  tabIndex = 0;

  tabsPlacement: string = 'bottom';
  tabsLayout: string = 'icon-top';

  constructor(
    public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams) {

    if (!this.platform.is('mobile')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }

    this.trips = fakeTrips;
    this.pastTrips = this.trips.filter(trip => {
      return trip.status === TripStatus.COMPLETED  // order
    });
    this.upcomingTrips = this.trips.filter(trip => {
      return trip.status === TripStatus.COMPLETED // TODO: change this to SCHEDULED, also order
    });
  }

  // get pastListPosition() {
  //   return this.timeDirection === 'past' ? 'center' : 'right';
  // }
  //
  // get upcomingListPosition() {
  //   return this.timeDirection === 'upcoming' ? 'center' : 'left';
  // }

  onTripClicked(trip: Trip) {
    this.navCtrl.push("TripDetailPage", { trip })
  }

}
