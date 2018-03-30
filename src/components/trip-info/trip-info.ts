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
  @Input() collapsed: boolean;

  constructor(private popoverCtrl: PopoverController) {}

  openInfoPopover() {
      this.popoverCtrl
        .create(InfoPage, {}, {cssClass: 'price-info-popover'})
        .present();
  } // TODO: make wider, show backdrop
}
