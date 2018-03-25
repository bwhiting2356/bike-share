import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

}
