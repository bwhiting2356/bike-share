import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

declare var google;

@Injectable()
export class AutocompleteProvider {
  googleAutocompleteService;

  constructor(private mapsAPILoader: MapsAPILoader) {
    this.mapsAPILoader.load().then(() => {
      this.googleAutocompleteService = new google.maps.places.AutocompleteService();
    })
  }

  getPlacePredictions(input) {
    if (input) {
      return new Promise(resolve => {
        this.mapsAPILoader.load().then(() => {
          this.googleAutocompleteService.getPlacePredictions({input}, results => {
            resolve(results);
          });
        })
      });
    } else {
      return Promise.resolve([]);
    }
  }
}
