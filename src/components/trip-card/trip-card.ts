import { Component, Input } from '@angular/core';
import { Trip } from '../../../shared/Trip';

@Component({
  selector: 'trip-card',
  templateUrl: 'trip-card.html',
})
export class TripCardComponent {
  @Input() trip: Trip;

  constructor() {
    console.log('trip: ', this.trip);
  }

}

// TODO: fix map rendering in the trip card
