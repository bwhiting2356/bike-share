import { Injectable } from '@angular/core';

@Injectable()
export class WindowProvider {

  get windowRef() {
    return window;
  }
}
