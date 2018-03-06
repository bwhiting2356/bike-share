import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth-service';

import { SearchPage } from "../search/search";

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
