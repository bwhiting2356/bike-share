import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth-service';

/**
 * Generated class for the LoginModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModalPage {

  constructor(
    private authService: AuthService,
    private viewCtrl: ViewController) {
  }

  googleLogin() {
    this.authService.googleLogin().then(() => {
      this.viewCtrl.dismiss();
    })
  }
}
