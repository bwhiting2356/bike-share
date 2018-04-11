import { Component } from '@angular/core';

/**
 * Generated class for the TripListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'trip-list',
  templateUrl: 'trip-list.html'
})
export class TripListComponent {

  text: string;

  constructor() {
    console.log('Hello TripListComponent Component');
    this.text = 'Hello World';
  }

}
