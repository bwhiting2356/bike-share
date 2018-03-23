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
import { CollapseIconComponent } from './collapse-icon/collapse-icon';
import { PhoneLoginComponent } from './phone-login/phone-login';

@NgModule({
	declarations: [
	  GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    SearchAutocompleteComponent,
    CollapseIconComponent,
    PhoneLoginComponent
  ],
	imports: [
	  CommonModule,
    PipesModule,
    IonicModule
  ],
	exports: [
	  GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    SearchAutocompleteComponent,
    CollapseIconComponent,
    PhoneLoginComponent
  ]
})
export class ComponentsModule {}
