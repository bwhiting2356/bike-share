import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModalPage {

  constructor(
    private viewCtrl: ViewController) {
  }

  loginSuccess() {
    console.log("log in success");
    this.viewCtrl.dismiss("Signed in successfully")
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
