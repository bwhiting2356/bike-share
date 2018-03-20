import { Directive } from '@angular/core';

/**
 * Generated class for the PhoneMaskDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[phone-mask]' // Attribute selector
})
export class PhoneMaskDirective {

  constructor() {
    console.log('Hello PhoneMaskDirective Directive');
  }

}
