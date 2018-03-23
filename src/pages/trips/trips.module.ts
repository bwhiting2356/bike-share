import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripsPage } from './trips';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TripsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TripsPage),
  ],
})
export class TripsPageModule {}
