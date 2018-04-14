import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripListPage } from './trip-list';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    TripListPage,
  ],
  entryComponents: [
    TripListPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TripListPage),
  ],
})
export class TripListPageModule {}
