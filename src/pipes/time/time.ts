import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(seconds: number): string {
    const minutes = seconds / 60;
    if (minutes < 60) {
      return Math.round(minutes) + ' min'
    } else {
      const hours = minutes / 60;
      const roundedHours = Math.round(hours * 10) / 10;
      return roundedHours + 'h';
    }
  }
}
