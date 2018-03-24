import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutocompleteProvider } from '../../providers/autocomplete/autocomplete';

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
  fetching: boolean = false;
  pristine: boolean = true;

  constructor(
    private autocompleteService: AutocompleteProvider) {
  }

  focus() {
    this.showAutocomplete = true;
    this.inputFocused.emit(true);
  }

  blur(event) {
    if (!event.value) {
      this.showAutocomplete = false;
    }
  }

  inputChange(e) {
    const term = e.target.value;
    this.fetching = true;
    this.pristine = false;
    this.autocompleteService.getPlacePredictions(term).then((results: any[]) => {
      this.autocompleteResults = results || [];
      this.fetching = false;
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
  }
}
