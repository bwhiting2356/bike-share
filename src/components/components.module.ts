import { NgModule } from '@angular/core';

// modules

import { PipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

// components

import { GoogleMapComponent } from './google-map/google-map';
import { TripCardComponent } from './trip-card/trip-card';
import { TripInfoComponent } from './trip-info/trip-info';
import { SearchAutocompleteComponent } from './search-autocomplete/search-autocomplete';

@NgModule({
	declarations: [
	  GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    SearchAutocompleteComponent
  ],
	imports: [
	  CommonModule,
    PipesModule,
    IonicModule.forRoot(TripCardComponent)
  ],
	exports: [
	  GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    SearchAutocompleteComponent
  ]
})
export class ComponentsModule {}
