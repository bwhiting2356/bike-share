import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeolocationService } from '../../services/geolocation-service';
import { AutocompleteService } from '../../services/autocomplete-service';
import { LatLng } from '../../../shared/LatLng';

const CURRENT_LOCATION = 'Current Location';

@Component({
  selector: 'search-autocomplete',
  templateUrl: 'search-autocomplete.html'
})
export class SearchAutocompleteComponent {
  @Input() showCurrentLocation;
  @Input() label;
  @Input() address;
  @Output() addressChange = new EventEmitter<string>();
  @Output() inputFocused = new EventEmitter<boolean>();
  @Input() showAutocomplete: boolean;
  autocompleteResults = [];

  text: string;

  constructor(
    private autocompleteService: AutocompleteService) {
  }

  focus() {
    this.showAutocomplete = true;
    this.inputFocused.emit(true);
  }

  blur() {
    this.showAutocomplete = false;
  }

  inputChange(e) {
    const term = e.target.value;
    this.autocompleteService.getPlacePredictions(term).then((results: any[]) => {
      this.autocompleteResults = results || [];
    })
  }

  chooseCurrentLocation() {
    this.address = CURRENT_LOCATION;
    this.addressChange.emit(CURRENT_LOCATION);
    this.showAutocomplete = false;
    this.autocompleteResults = [];
  }

  chooseAutocompleteItem(result) {
    const part1 = result.structured_formatting.main_text || '';
    const part2 = result.structured_formatting.secondary_text || '';

    let address = part1;
    if (part2) {
      address += `, ${part2}`
    }
    address = address
      .replace(", USA", "")
      .replace(", United States", "");

    this.address = address;
    this.addressChange.emit(address);
    this.showAutocomplete = false;
    this.autocompleteResults = [];

    // TODO: leave off 'USA'? (looking ahead to presentation in the trip data)
  }
}
