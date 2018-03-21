import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { SearchPage } from "../search/search";

import * as firebase from 'firebase/app';
import { AuthProvider } from '../../providers/auth/auth';
import { WindowProvider } from '../../providers/window/window';

export class PhoneNumber {
  country: string = "1";
  number: string;

  get e164() {
    const num = this.country + this.number;
    return `+${num}`;
  }
}



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    private zone: NgZone,
    private toastCtrl: ToastController,
    private windowService: WindowProvider,
    private authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  loginSuccess() {
    this.navCtrl.setRoot(SearchPage, {toast: "Signed in successfully"});
  }

}
