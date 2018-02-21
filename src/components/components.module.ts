import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { TripCardComponent } from './trip-card/trip-card';
import { PipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TripListComponent } from './trip-list/trip-list';

@NgModule({
	declarations: [GoogleMapComponent,
    TripCardComponent,
    TripListComponent],
	imports: [CommonModule, PipesModule, IonicModule.forRoot(TripCardComponent)],
	exports: [GoogleMapComponent,
    TripCardComponent,
    TripListComponent]
})
export class ComponentsModule {}
