import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Trip } from '../../../shared/Trip';

/**
 * Generated class for the TripListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'trip-list',
  templateUrl: 'trip-list.html',
  animations: [
    trigger('moveOffLeft', [
      state('center', style([{
        backgroundColor: 'red',
        transform: 'translateX(0%)'
      }])),
      state('left', style([{
        transform: 'translateX(-110%)'
      }])),
      transition('center => left', animate('200ms')),
    ]),
    trigger('moveOffRight', [
      state('center', style([{
        backgroundColor: 'red',
        transform: 'translateX(0%)'
      }])),
      state('right', style([{
        transform: 'translateX(110%)'
      }])),
      transition('center => right', animate('200ms'))
    ]),
    trigger('moveCenterFromLeft', [
      state('left', style([{
        transform: 'translateX(-110%)'
      }])),
      state('center', style([{
        backgroundColor: 'red',
        transform: 'translateX(0%)'
      }])),
      transition('left => center', animate('200ms'))
    ]),
    trigger('moveCenterFromRight', [
      state('center', style([{
        backgroundColor: 'red',
        transform: 'translateX(0%)'
      }])),
      state('right', style([{
        transform: 'translateX(110%)'
      }])),
      transition('right => center', animate('200ms'))
    ])
  ]
})
export class TripListComponent {
  @Input() position: string;
  @Input() trips: Trip[];
  @Output() tripClicked = new EventEmitter<Trip>()

  text: string;

  constructor() { }

  onTripClicked(trip) {
    this.tripClicked.emit(trip);
  }

}
