import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SearchPage } from '../pages/search/search';
import { TripsPage } from '../pages/trips/trips';
import { SearchResultPage } from '../pages/search-result/search-result';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth-service';

interface Page {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  isAnonymous;
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SearchPage;

  pages: Array<Page>;
  loginPage: Page;

  constructor(private authService: AuthService,
              public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private toastCtrl: ToastController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Search', icon: 'search', component: SearchPage },
      { title: 'Trips', icon: 'bicycle', component: TripsPage },
    ];
    this.loginPage = { title: 'Log in', icon: 'person', component: LoginPage };
    this.isAnonymous = this.authService.isAnonymous();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  signOut() {
    this.authService.signOut()
      .then(() => {
        this.toastCtrl.create({
          message: 'Signed out successfully',
          duration: 3000,
          position: 'bottom'
        }).present();
      })
      .catch(err => {
        this.toastCtrl.create({
          message: `Error: ${err}`,
          duration: 3000,
          position: 'bottom'
        }).present();
      })
  }
}
