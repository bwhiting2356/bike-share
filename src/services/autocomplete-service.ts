import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class AutocompleteService {
  autocompleteService;

  constructor(
    private zone: NgZone) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getPlacePredictions(input) {
    if (input) {
      return new Promise(resolve => {
        this.autocompleteService.getPlacePredictions({input}, results => {
          resolve(results);
        });
      });
    } else {
      return Promise.resolve([]);
    }
  }
}
