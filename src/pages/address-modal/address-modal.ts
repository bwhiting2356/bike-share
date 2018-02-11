import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { AutocompleteService } from '../../services/autocomplete-service';
import { GeolocationService } from '../../services/geolocation-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Keyboard } from '@ionic-native/keyboard';
import { Renderer } from '@angular/core';

import 'rxjs/add/observable/fromPromise';

/**
 * Generated class for the AddressModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address-modal',
  templateUrl: 'address-modal.html',
})
export class AddressModalPage implements AfterViewInit {
  @ViewChild('searchbar') searchbar: Searchbar;
  autocompleteResults: Observable<any>;
  title: string;
  userAddress$;

  constructor(
    private autocompleteService: AutocompleteService,
    private geolocationService: GeolocationService,
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.userAddress$ = this.geolocationService.userAddress$;
  }

  ngAfterViewInit() {

    // TODO: focus input after animation (web and mobile)
  }

  ionViewDidLoad() {
    this.title = this.navParams.get('title');

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus()
    }, 150)
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  clearInput() {
    this.autocompleteResults = Observable.of(null);
  }

  chooseCurrentLocation() {
    this.userAddress$.subscribe(address => {
      this.viewCtrl.dismiss(address);
    })
  }

  chooseAutocompleteItem(result) {
    const address = result.structured_formatting.main_text + ", " + result.structured_formatting.secondary_text;
    this.viewCtrl.dismiss(address);
  }

  searchChange(e) {
    const value = e.target.value;
    if (value) {
      this.autocompleteResults = Observable.fromPromise(this.autocompleteService.getPlacePredictions(e.target.value));
    } else {
      this.autocompleteResults = Observable.of(null);
    }
  }

}
