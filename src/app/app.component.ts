import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';

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
              private toastCtrl: ToastController) {

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

  openPage(page: Page) {
    if (this.nav) {
      this.nav.setRoot(page.component);
    }
  }

  isActive(page: Page) {
    if (!this.nav) return;
    const active = this.nav.getActive();

    if (typeof page.component === 'string') { // if it's a lazy loaded page
      return active ? active.component.name === page.component : false;
    } else {
      return active ? active.component === page.component : false;
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
