import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';
import { LoginModalPage } from '../../pages/login-modal/login-modal';

@Component({
  selector: 'custom-nav',
  templateUrl: 'custom-nav.html'
})
export class CustomNavComponent {
  @Input() title;

  text: string;

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) {

  }

  signIn() {
    console.log('sign in');
    const loginModal = this.modalCtrl.create(LoginModalPage);
    loginModal.present();
    loginModal.onDidDismiss(toast => {
      if (toast) {
        this.toastCtrl.create({
          message: toast,
          duration: 3000,
          position: 'bottom'
        }).present();
      } // TODO: test to make sure this is working
    })
  }

}
