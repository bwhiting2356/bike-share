import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripsPage } from './trips';
import { ComponentsModule } from '../../components/components.module';
import { TripListPageModule} from "./trip-list/trip-list.module";
import { StatsPageModule } from "./stats/stats.module";

@NgModule({
  declarations: [
    TripsPage,
  ],
  imports: [
    TripListPageModule,
    ComponentsModule,
    StatsPageModule,
    IonicPageModule.forChild(TripsPage),
  ]
})
export class TripsPageModule {}
