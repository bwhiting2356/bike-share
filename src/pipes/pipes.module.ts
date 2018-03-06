import { NgModule } from '@angular/core';
import { TimePipe } from './time/time';
import { DistancePipe } from './distance/distance';
@NgModule({
	declarations: [
	  TimePipe,
    DistancePipe
  ],
	imports: [],
	exports: [
	  TimePipe,
    DistancePipe
  ]
})
export class PipesModule {}
