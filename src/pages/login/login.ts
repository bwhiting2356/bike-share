import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth-service';

import { SearchPage } from "../search/search";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  googleLogin() {
    this.authService.googleLogin().then(() => {
      this.navCtrl.setRoot(SearchPage, { toast: "Logged in successfully" });
    })
  }

}
