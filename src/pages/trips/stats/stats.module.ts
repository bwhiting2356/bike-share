import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatsPage } from './stats';
import { ComponentsModule } from "../../../components/components.module";
import { ChartsModule } from "ng2-charts";

@NgModule({
  declarations: [
    StatsPage,
  ],
  imports: [
    ChartsModule,
    ComponentsModule,
    IonicPageModule.forChild(StatsPage),
  ],
})
export class StatsPageModule {}
