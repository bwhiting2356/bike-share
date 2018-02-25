import { Component, Input } from '@angular/core';
import { Trip } from '../../../shared/Trip';

/**
 * Generated class for the TripInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'trip-info',
  templateUrl: 'trip-info.html'
})
export class TripInfoComponent {
  @Input() trip: Trip;

  text: string;

  constructor() {
    console.log('Hello TripInfoComponent Component');
    this.text = 'Hello World';
  }

}
