import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Injectable()
export class AutocompleteProvider {
  googleAutocompleteService: any;

  constructor(private mapsAPILoader: MapsAPILoader) {
    this.mapsAPILoader.load().then(() => {
      this.googleAutocompleteService = new google.maps.places.AutocompleteService();
    }) // TODO: can't use async await here because it's a constructor. Maybe factor out?
  }

  async getPlacePredictions(input: string): Promise<any[]> {
    await this.mapsAPILoader.load();
    if (input) {
      return new Promise<any[]>(resolve => {
        this.googleAutocompleteService.getPlacePredictions({input}, (results: any) => {
          resolve(results);
        });
      })
    } else {
      return [];
    }
  }
}
