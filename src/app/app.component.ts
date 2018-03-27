import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SearchPage } from '../pages/search/search';
import { TripsPage } from '../pages/trips/trips';
import { LoginPage } from '../pages/login/login';
import { PaymentsPage } from '../pages/payments/payments';
import { TempPage } from '../pages/temp/temp';
import { AuthProvider } from '../providers/auth/auth';

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

  initialPages: Array<Page>;
  userPages: Array<Page>;
  loginPage: Page;

  constructor(private authService: AuthProvider,
              public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private toastCtrl: ToastController) {
    this.initializeApp();

    this.initialPages = [
      { title: 'Search', icon: 'search', component: SearchPage },
    ];
    this.loginPage = { title: 'Log in', icon: 'person', component: LoginPage }; // keep separate so I can remove it when signed in

    this.userPages = [
      { title: 'Trips', icon: 'bicycle', component: "TripsPage" }, // TODO: add auth guards, hide when not authenticated
      { title: 'Payments', icon: 'card', component: "PaymentsPage" }
    ];

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
