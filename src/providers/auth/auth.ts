import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// firebase

import { AngularFireAuth } from 'angularfire2/auth';

import { map } from 'rxjs/operators';


@Injectable()
export class AuthProvider {
  authState: any = null;

  constructor(
    public afAuth: AngularFireAuth,
  ) {
    if (!this.currentUserId) this.anonymousLogin();

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    }); // TODO: why am I doing this? Is this redundant?
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  } // TODO: why is this here if I'm not using it?

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  get currentUserIdObservable(): Observable<any> {
    return this.afAuth.idToken;
  }

  isAnonymous(): Observable<boolean> {
    return this.afAuth.authState
      .pipe(
        map(auth => {
          if (auth) {
            return auth.isAnonymous;
          } else {
            return false;
          }
        })
      );
  }

  async anonymousLogin() {
    try {
      this.authState = await this.afAuth.auth.signInAnonymously();
    } catch(err) {
      console.log(err)
    }
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut()
  }

  phoneSignInSuccess(auth) {
    this.authState = auth;
    // TODO: transfer search result params over to new user
  }
}
