import { Pipe, PipeTransform } from '@angular/core';

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
