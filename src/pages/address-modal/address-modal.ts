import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { AutocompleteService } from '../../services/autocomplete-service';
import { GeolocationService } from '../../services/geolocation-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Keyboard } from '@ionic-native/keyboard';
import { Renderer } from '@angular/core';

import 'rxjs/add/observable/fromPromise';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/first";

import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  providers: [Keyboard]
})
export class AddressModalPage implements AfterViewInit {
  @ViewChild('searchbar') searchbar: Searchbar;
  searchControl: FormControl;
  latestSearchTerm: BehaviorSubject<string> = new BehaviorSubject('');
  fetching: boolean = false;
  autocompleteResults;
  title: string;
  userAddress: string = '';

  constructor(
    private keyboard: Keyboard,
    private autocompleteService: AutocompleteService,
    private geolocationService: GeolocationService,
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.searchControl = new FormControl();
    this.geolocationService.userAddress$.first().subscribe(address => {
      this.userAddress = address || undefined;
    });
  }

  ngAfterViewInit() {
    // var eventObservable = Observable.fromEvent(
    //   this.searchbar.nativeElement, 'keyup');
    this.searchbar.debounce

    // TODO: focus input after animation (web and mobile)
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
    setTimeout(() => {
      this.searchbar.setFocus();
      this.keyboard.show();
    }, 150)
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  clearInput() {
    this.autocompleteResults = null;
  }

  chooseCurrentLocation() {
    this.viewCtrl.dismiss(this.userAddress);
  }

  chooseAutocompleteItem(result) {
    const part1 = result.structured_formatting.main_text || '';
    const part2 = result.structured_formatting.secondary_text || '';
    let address = part1;
    if (part2) {
      address += `, ${part2}`
    }
    this.viewCtrl.dismiss(address);
  }

  searchChange(e) {
    this.latestSearchTerm.next(e.target.value);
  }

  // TODO: debounce autocomplete input
  // TODO: add spinner when waiting for response

}
