import { ApplicationRef, Component, NgZone } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { GeolocationService } from '../../services/geolocation-service';
import { LatLng } from '../../shared/LatLng';
import 'rxjs/add/operator/startWith';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AddressModalPage } from '../address-modal/address-modal';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  center;
  origin: string;
  originCoords: BehaviorSubject<LatLng>;
  destination: string;
  destinationCoords: BehaviorSubject<LatLng>;
  timeTarget: string = 'Depart at';
  datetime;

  constructor(
    private modalCtrl: ModalController,
    private geolocationService: GeolocationService,
    private zone: NgZone,
    private applicationRef: ApplicationRef,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.datetime = new Date().toISOString();
    this.originCoords = new BehaviorSubject(null)
    this.destinationCoords = new BehaviorSubject(null)
    this.geolocationService.getCurrentPosition();
    this.center = this.geolocationService.userLocation$;
  }

  ionViewDidLoad() {
    this.geolocationService.getCurrentPosition();
  }

  openOriginModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Origin" });
    modal.present();
    modal.onDidDismiss((choice) => {
      this.zone.run(() => {
        if (choice) {
          this.origin = choice;
          this.geolocationService.geocode(choice).then(latlng => {
            this.originCoords.next(latlng);
          });
        }
      })
    });
  }

  openDestinationModal() {
    const modal = this.modalCtrl.create(AddressModalPage, {title: "Destination"});
    modal.present();
    modal.onDidDismiss((choice) => {
      if (choice) {
        this.destination = choice;
        this.geolocationService.geocode(choice).then(latlng => {
          this.destinationCoords.next(latlng);
        });
      }
    });
  }

  get disableButton() {
    return !this.origin || !this.destination;
  }
}
