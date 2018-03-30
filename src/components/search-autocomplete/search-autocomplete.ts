import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutocompleteProvider } from '../../providers/autocomplete/autocomplete';
import { ToastController } from 'ionic-angular';

const CURRENT_LOCATION = 'Current Location';

@Component({
  selector: 'search-autocomplete',
  templateUrl: 'search-autocomplete.html'
})
export class SearchAutocompleteComponent {
  @Input() showCurrentLocation: boolean;
  @Input() label: string;
  @Input() address: string;
  @Output() addressChange = new EventEmitter<string>();
  @Output() inputFocused = new EventEmitter<boolean>();
  @Input() showAutocomplete: boolean;
  autocompleteResults: any[] = [];
  offlineToastShowing = false;

  text: string;
  fetching: boolean = false;
  pristine: boolean = true;

  constructor(
    private toastCtrl: ToastController,
    private autocompleteService: AutocompleteProvider) {
  }

  focus() {
    this.showAutocomplete = true;
    this.inputFocused.emit(true);
  }

  blur(event: any) { // TODO: what type is this? If it's FocusEvent, why am I accessing event.value?
    if (!event.value) {
      setTimeout(() => {
        this.showAutocomplete = false;
      }, 100) // TODO: I'm not sure why this is necessary
    }
  }

  async inputChange(e: any) { // TODO: find actual event type
    const term = e.target.value;
    this.fetching = true;
    this.pristine = false;
    if (navigator.onLine) {
      this.autocompleteResults = await this.autocompleteService.getPlacePredictions(term) || [];
      this.fetching = false;
    } else {
      if (!this.offlineToastShowing) {
        const toast = this.toastCtrl.create({
          message: "No network connection",
          duration: 3000,
          position: 'top'
        });
        toast.onDidDismiss(() => {
          this.offlineToastShowing = false;
        });
        toast.present();
        this.offlineToastShowing = true;
        this.fetching = false; // TODO: it still seems to be displaying the spinner and fetching section...
      }
    }
  }

  chooseCurrentLocation() {
    this.address = CURRENT_LOCATION;
    this.addressChange.emit(CURRENT_LOCATION);
    this.showAutocomplete = false;
    this.autocompleteResults = [];
  }

  chooseAutocompleteItem(result: any) {
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
