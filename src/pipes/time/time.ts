import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(minutes: number): string {
    if (minutes < 60) {
      return minutes + ' min'
    } else {
      const hours = minutes / 60;
      const roundedHours = Math.round(hours * 10) / 10;
      return roundedHours + 'h';
    }
  }
}
