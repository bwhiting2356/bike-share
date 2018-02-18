import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { TripCardComponent } from './trip-card/trip-card';
import { PipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [GoogleMapComponent,
    TripCardComponent],
	imports: [CommonModule, PipesModule, IonicModule.forRoot(TripCardComponent)],
	exports: [GoogleMapComponent,
    TripCardComponent]
})
export class ComponentsModule {}
