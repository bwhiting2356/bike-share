import { Component, Input } from '@angular/core';
import { Trip } from '../../../shared/Trip';

@Component({
  selector: 'trip-info',
  templateUrl: 'trip-info.html'
})
export class TripInfoComponent {
  @Input() trip: Trip;
  collapsed = false;

  collapseToggle() {
    this.collapsed = !this.collapsed;
  }
}
