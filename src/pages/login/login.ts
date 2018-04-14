import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SearchPage } from "../search/search";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController) {
  }

  loginSuccess() {
    this.navCtrl.setRoot(SearchPage, {toast: "Signed in successfully"});
  }

}
