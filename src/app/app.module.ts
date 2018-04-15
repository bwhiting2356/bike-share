import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// ionic native

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// TODO: what can I remove if it's PWA only?

import { Geolocation } from '@ionic-native/geolocation';
import { GooglePlus } from '@ionic-native/google-plus';

// pages

import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';

import { SearchResultPage } from '../pages/search/search-result/search-result';
import { LoginPage } from '../pages/login/login';
import { LoginModalPage } from '../pages/login-modal/login-modal';

// import { TempPage } from '../pages/temp/temp';

// lazy loaded pages

/*
import { TripsPage } from '../pages/trips/trips';
import { TripDetailPage } from '../pages/trip-detail/trip-detail';
import { PaymentsPage } from '../pages/payments/payments';
 */


// module imports

import { PipesModule } from '../pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from "../components/components.module";
import { AgmCoreModule } from '@agm/core';

// firebase

import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from "angularfire2/auth";

// providers

import { AuthProvider } from '../providers/auth/auth';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { AutocompleteProvider } from '../providers/autocomplete/autocomplete';
import { WindowProvider } from '../providers/window/window';


import { environment } from "../environments/environment";
import { InfoPage } from '../pages/info/info';
import { QRScanner } from "@ionic-native/qr-scanner";
import { PaymentsProvider } from '../providers/payments/payments';
import { HelpPage } from "../pages/help/help";
import {MaterialModule} from "../material/material.module";


@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    SearchResultPage,
    LoginPage,
    LoginModalPage,
    InfoPage,
    HelpPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }),
    AgmCoreModule.forRoot({
      libraries: ['places'],
      apiKey: environment.googleMapsKey
    }),
    MaterialModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    SearchResultPage,
    LoginPage,
    LoginModalPage,
    InfoPage,
    HelpPage,
  ],
  providers: [
    Geolocation,
    GooglePlus,
    StatusBar,
    SplashScreen,
    AngularFirestore,
    AngularFireDatabase,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AutocompleteProvider,
    FirestoreProvider,
    AuthProvider,
    GeolocationProvider,
    AutocompleteProvider,
    WindowProvider,
    QRScanner,
    PaymentsProvider
  ]
})
export class AppModule {}
