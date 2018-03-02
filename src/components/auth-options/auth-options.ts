import { Component } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';

import { environment } from "../../environments/environment";
import { FirebaseService } from '../../services/firebase-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'auth-options',
  templateUrl: 'auth-options.html'
})
export class AuthOptionsComponent {

  user: Observable<firebase.User>;

  constructor(private authService: AuthService) {

    // this.user = this.firebaseService.user;
  }

  googleLogin() {
    this.authService.googleLogin().then(() => {

    })
    // if (this.platform.is('cordova')) {
    //   this.nativeGoogleLogin();;
    // } else {
    //   this.webGoogleLogin();
    // }
  }
  //
  // async nativeGoogleLogin(): Promise<void> {
  //   try {
  //     const gplusUser = await this.gplus.login({
  //       'webClientId': environment.googleWebClientID,
  //       'offline': true,
  //       'scopes': 'profile email'
  //     });
  //
  //     return await this.afAuth.auth.signInWithCredential(
  //       firebase.auth.GoogleAuthProvider.credential(gplusUser.token)
  //     )
  //
  //
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  //
  // async webGoogleLogin(): Promise<void> {
  //   try {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     const credential = await this.afAuth.auth.signInWithPopup(provider);
  //
  //   } catch (err) {
  //     console.log(err);
  //   }
  //
  // }

  // signOut() {
  //   this.afAuth.auth.signOut();
  //   if (this.platform.is('cordova')) {
  //     this.gplus.logout();
  //   }
  // }

}
