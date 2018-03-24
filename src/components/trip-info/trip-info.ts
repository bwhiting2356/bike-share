import { Component, Input } from '@angular/core';
import { Trip } from '../../../shared/Trip';
import { PopoverController } from 'ionic-angular';
import { InfoPage } from '../../pages/info/info';

@Component({
  selector: 'trip-info',
  templateUrl: 'trip-info.html'
})
export class TripInfoComponent {
  @Input() trip: Trip;
  collapsed = false;

  constructor(private popoverCtrl: PopoverController) {}

  collapseToggle() {
    this.collapsed = !this.collapsed;
  }

  openInfoPopover() {
    this.popoverCtrl.create(InfoPage).present();
  } // TODO: make wider, show backdrop
}
