import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';

declare var google;

@Injectable()
export class AutocompleteService {
  googleAutocompleteService;

  constructor(
    private zone: NgZone) {
    this.googleAutocompleteService = new google.maps.places.AutocompleteService();
  }

  getPlacePredictions(input) {
    if (input) {
      return new Promise(resolve => {
        this.googleAutocompleteService.getPlacePredictions({input}, results => {
          resolve(results);
        });
      });
    } else {
      return Promise.resolve([]);
    }
  }
}
