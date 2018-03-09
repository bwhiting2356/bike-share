import { Injectable } from '@angular/core';


// firebase



@Injectable()
export class WindowService {
  get windowRef() {
    return window;
  }

}
