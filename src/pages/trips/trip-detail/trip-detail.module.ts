import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripDetailPage } from './trip-detail';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    TripDetailPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TripDetailPage),
  ],
})
export class TripDetailPageModule {}
