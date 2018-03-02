import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { TripCardComponent } from './trip-card/trip-card';
import { PipesModule } from '../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TripInfoComponent } from './trip-info/trip-info';
import { AuthOptionsComponent } from './auth-options/auth-options';

@NgModule({
	declarations: [GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    AuthOptionsComponent],
	imports: [CommonModule, PipesModule, IonicModule.forRoot(TripCardComponent)],
	exports: [GoogleMapComponent,
    TripCardComponent,
    TripInfoComponent,
    AuthOptionsComponent]
})
export class ComponentsModule {}
