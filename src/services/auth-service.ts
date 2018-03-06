import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/take';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';

import { environment } from '../environments/environment';


@Injectable()
export class AuthService {
  authState: any = null;

  constructor(
    private gplus: GooglePlus,
    private platform: Platform,
    public afAuth: AngularFireAuth,
  ) {
    if (!this.currentUserId) this.anonymousLogin();

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  get currentUserIdObservable(): Observable<any> {
    return this.afAuth.idToken;
  }

  isAnonymous(): Observable<boolean> {
    return this.afAuth.authState.map(auth => {
      if (auth) return auth.isAnonymous;
      return true;
    });
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user;
        // this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  signOut(): Promise<void> {
    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
    return this.afAuth.auth.signOut()
  }

  // google login

  googleLogin(): Promise<void> {
    if (this.platform.is('cordova')) {
      return this.nativeGoogleLogin(); // TODO: get cordova plugin working for native google login
    } else {
      return this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': environment.googleWebClientID,
        'offline': true,
        'scopes': 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.token)
      )


    } catch (err) {
      console.log(err);
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);

    } catch (err) {
      console.log(err);
    }
  }
}
