import { Component, Input } from '@angular/core';
import { Trip } from '../../pages/history/fakeTrips';

/**
 * Generated class for the TripCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'trip-card',
  templateUrl: 'trip-card.html',
})
export class TripCardComponent {
  @Input() trip: Trip;

  constructor() {}

}
