import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModalPage {

  constructor(
    private authService: AuthProvider,
    private viewCtrl: ViewController) {
  }

  loginSuccess() {
    this.viewCtrl.dismiss({toast: "Logged in successfully"})
  }
}
