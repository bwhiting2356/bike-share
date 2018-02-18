import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DistancePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {
  transform(feet: number): string {
    if (feet < 1000) {
      return feet + ' ft'
    } else {
      const miles = feet / 5280;
      const roundedMiles =  Math.round( miles * 10 ) / 10;
      return roundedMiles + ' mi';
    }
  }
}
