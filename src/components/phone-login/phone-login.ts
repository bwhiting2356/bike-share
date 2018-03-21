import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';


import * as firebase from 'firebase/app';
import { AuthProvider } from '../../providers/auth/auth';
import { WindowProvider } from '../../providers/window/window';


export class PhoneNumber {
  country: string = "+1";
  number: string;

  get e164() {
    const num = this.country + this.number;
    return `${num}`;
  }
}

@Component({
  selector: 'phone-login',
  templateUrl: 'phone-login.html'
})
export class PhoneLoginComponent implements OnInit {
  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;

  @Output() loginSuccess: EventEmitter<any> = new EventEmitter();

  constructor(
    private toastCtrl: ToastController,
    private windowService: WindowProvider,
    private authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.verificationCode = '';
  }

  ngOnInit () {
    this.windowRef = this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  displayToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    }).present()

  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
        this.displayToast(`Code sent to ${this.phoneNumber.number}`);
      })
      .catch(error => {
        this.displayToast(error);
      });
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.authService.phoneSignInSuccess(result.user);
        this.loginSuccess.emit();
      })
      .catch(error => {
        this.displayToast(error);
      });
  }
}









