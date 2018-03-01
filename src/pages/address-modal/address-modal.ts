import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { AutocompleteService } from '../../services/autocomplete-service';
import { GeolocationService } from '../../services/geolocation-service';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/first";

import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LatLng } from '../../../shared/LatLng';
import { Keyboard } from '@ionic-native/keyboard';

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
export class AddressModalPage {
  @ViewChild('searchbar') searchbar: Searchbar;
  searchControl: FormControl;
  latestSearchTerm: BehaviorSubject<string> = new BehaviorSubject('');
  fetching: boolean = false;
  autocompleteResults;
  title: string;

  userLocation: LatLng;
  showCurrentLocation: boolean;

  constructor(
    private keyboard: Keyboard,
    private autocompleteService: AutocompleteService,
    private geolocationService: GeolocationService,
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.showCurrentLocation = false;

    this.searchControl = new FormControl();
    this.geolocationService.foundPosition.take(1).subscribe(value => {
      this.showCurrentLocation = value;
    })
  }

  ionViewDidLoad() {
    this.title = this.navParams.get('title');
    this.latestSearchTerm.debounceTime(400).subscribe(value => {
      if (value) {
        this.fetching = true;
        this.autocompleteService.getPlacePredictions(value).then(results => {
          this.autocompleteResults = results;
          this.fetching = false;
        })
      } else {
        this.fetching = false;
        this.autocompleteResults = null;
      }
    })
    // TODO: sometimes old results coming in after new ones - use switchMap?
  }

  ionViewDidEnter() {
    console.log("Address modal loaded");
    setTimeout(() => {
      this.keyboard.show();
      this.searchbar.setFocus()
      this.keyboard.onKeyboardShow().subscribe(() => {
        this.searchbar.setFocus();
      })
    }, 2000)
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  clearInput() {
    this.autocompleteResults = null;
  }

  chooseCurrentLocation() {
    this.viewCtrl.dismiss("Current Location");
  }

  chooseAutocompleteItem(result) {
    const part1 = result.structured_formatting.main_text || '';
    const part2 = result.structured_formatting.secondary_text || '';
    let address = part1;
    if (part2) {
      address += `, ${part2}`
    }
    this.viewCtrl.dismiss(address);

    // TODO: leave off 'USA'? (looking ahead to presentation in the trip data)
  }

  searchChange(e) {
    this.latestSearchTerm.next(e.target.value);
  }
}
