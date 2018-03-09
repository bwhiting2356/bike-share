import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth-service';

import { SearchPage } from "../search/search";
import { WindowService } from '../../services/window-service';

import * as firebase from 'firebase/app';

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;

  get e164() {
    const num = this.country + this.area + this.prefix + this.line;
    return `${num}`;
  }
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  code: string;


  windowRef: any;

  phoneNumber: string;
  phoneNumberMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  verificationCode: string;

  user: any;

  constructor(
    private zone: NgZone,
    private toastCtrl: ToastController,
    private windowService: WindowService,
    private authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.verificationCode = '';
  }

  ngOnInit() {
    this.windowRef = this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': response => {
        console.log(response);
      }
    });

    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container"', {
    //   'size': 'invisible',
    //   'callback': function(response) {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     console.log('recaptcha response: ', response)
    //   }
    // });
    this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = "+1" + this.phoneNumber;
    console.log(num);
    firebase.auth().signInWithPhoneNumber(num, appVerifier) // convert to string?
      .then(result => {
        this.windowRef.confirmationResult = result;
        console.log(this.windowRef.confirmationResult);
      })
      .catch(error => console.log(error));
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.user = result.user.uid;
        console.log(result.userId);
      })
      .catch(error => {
        console.log(error, "Incorrect code entered?")
      })
  }

  save() {
    this.phoneNumber = this.phoneNumber.replace(/\D+/g, '');
  }

}
