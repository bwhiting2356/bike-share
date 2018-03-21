import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/take';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';


@Injectable()
export class AuthProvider {
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
    return this.afAuth.auth.signOut()
  }

  phoneSignInSuccess(auth) {
    this.authState = auth;
  }
}
