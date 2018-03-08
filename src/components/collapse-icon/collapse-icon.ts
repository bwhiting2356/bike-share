import { Component, Input } from '@angular/core';

/**
 * Generated class for the CollapseIconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'collapse-icon',
  templateUrl: 'collapse-icon.html'
})
export class CollapseIconComponent {
  @Input() collapsed: boolean;

  get topIcon() {
    return this.collapsed ? 'ios-arrow-up' : 'ios-arrow-down';
  }

  get bottomIcon() {
    return this.collapsed ? 'ios-arrow-down' : 'ios-arrow-up';

  }

  constructor() { }

}
