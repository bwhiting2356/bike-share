import { Component } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';
import { LoginModalPage } from '../../pages/login-modal/login-modal';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'signin-button',
  templateUrl: 'signin-button.html'
})
export class SigninButtonComponent {
  isAnonymous: Observable<boolean>;

  constructor(
    private authService: AuthProvider,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) {
    this.isAnonymous = this.authService.isAnonymous();
  }

  signIn() {
    const loginModal = this.modalCtrl.create(LoginModalPage);
    loginModal.present();
    loginModal.onDidDismiss(toast => {
      if (toast) {
        this.toastCtrl.create({
          message: toast,
          duration: 3000,
          position: 'bottom'
        }).present();
      }
    })
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.toastCtrl.create({
        message: 'Signed out successfully',
        duration: 3000,
        position: 'bottom'
      }).present();
    } catch(err) {
      this.toastCtrl.create({
        message: `Error: ${err}`,
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }
}
