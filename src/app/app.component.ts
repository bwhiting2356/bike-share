import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SearchPage } from '../pages/search/search';
import { TripsPage } from '../pages/trips/trips';
import { LoginPage } from '../pages/login/login';
import { PaymentsPage } from '../pages/payments/payments';
import { AuthProvider } from '../providers/auth/auth';
import { Observable } from 'rxjs/Observable';
import { HelpPage } from "../pages/help/help";

interface Page {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  isAnonymous: Observable<boolean>;
  @ViewChild(Nav) nav: Nav | undefined;

  rootPage: any = SearchPage;

  initialPages: Array<Page>;
  userPages: Array<Page>;
  loginPage: Page;

  constructor(private authService: AuthProvider,
              public platform: Platform,
              // public statusBar: StatusBar,
              // public splashScreen: SplashScreen,
              private toastCtrl: ToastController) {
    this.initializeApp();

    this.initialPages = [
      { title: 'Search', icon: 'search', component: SearchPage },
      { title: 'Help', icon: 'help', component: HelpPage }
    ];
    this.loginPage = { title: 'Log in', icon: 'person', component: LoginPage }; // keep separate so I can remove it when signed in

    this.userPages = [
      { title: 'Trips', icon: 'bicycle', component: "TripsPage" }, // TODO: add auth guards, hide when not authenticated
      { title: 'Payments', icon: 'card', component: "PaymentsPage" }
    ];

    this.isAnonymous = this.authService.isAnonymous();

  }

  async initializeApp() {
    await this.platform.ready();
    // this.statusBar.styleDefault();
    // this.splashScreen.hide();
  }

  openPage(page: Page) {
    if (this.nav) {
      this.nav.setRoot(page.component);
    }
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
