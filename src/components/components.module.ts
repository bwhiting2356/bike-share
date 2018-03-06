import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { TripCardComponent } from './trip-card/trip-card';
import { PipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TripInfoComponent } from './trip-info/trip-info';
import { AuthOptionsComponent } from './auth-options/auth-options';
import { SearchbarComponent } from './searchbar/searchbar';
import { SearchAutocompleteComponent } from './search-autocomplete/search-autocomplete';

@NgModule({
	declarations: [GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    AuthOptionsComponent,
    SearchbarComponent,
    SearchAutocompleteComponent],
	imports: [CommonModule, PipesModule, IonicModule.forRoot(TripCardComponent)],
	exports: [GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    AuthOptionsComponent,
    SearchbarComponent,
    SearchAutocompleteComponent]
})
export class ComponentsModule {}
