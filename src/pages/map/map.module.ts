import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import { GoogleMapComponent } from '../../components/google-map/google-map';

@NgModule({
  declarations: [
    GoogleMapComponent,
    MapPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPage),
  ],
})
export class MapPageModule {}
