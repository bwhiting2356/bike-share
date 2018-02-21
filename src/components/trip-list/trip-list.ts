import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../shared/Trip';

@Component({
  selector: 'trip-list',
  templateUrl: 'trip-list.html'
})
export class TripListComponent implements OnInit {
  @Input() trips: Trip[];

  constructor() {
    console.log(this.trips);
  }

  ngOnInit() {
    console.log(this.trips);

  }

}
