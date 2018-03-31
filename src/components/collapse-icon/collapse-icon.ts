import { Component, Input } from '@angular/core';

@Component({
  selector: 'collapse-icon',
  templateUrl: 'collapse-icon.html'
})
export class CollapseIconComponent {
  @Input() collapsed: boolean = false;

  constructor() { }

}
