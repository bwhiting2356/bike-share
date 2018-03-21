import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// pages

import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { TripsPage } from '../pages/trips/trips';
import { TripDetailPage } from '../pages/trip-detail/trip-detail';
import { SearchResultPage } from '../pages/search-result/search-result';
import { LoginPage } from '../pages/login/login';
import { LoginModalPage } from '../pages/login-modal/login-modal';
import { PaymentsPage } from '../pages/payments/payments';

// services

import { AuthService } from '../services/auth-service';
import { WindowService } from '../services/window-service';


// module imports

import { PipesModule } from '../pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from "../components/components.module";

// firebase

import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from "angularfire2/auth";

// providers

import { Geolocation } from '@ionic-native/geolocation';
import { GooglePlus } from '@ionic-native/google-plus';

import { environment } from "../../environments/environment";
import { TempPage } from '../pages/temp/temp';

import { AuthProvider } from '../providers/auth/auth';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { AutocompleteProvider } from '../providers/autocomplete/autocomplete';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    SearchResultPage,
    TripsPage,
    TripDetailPage,
    LoginPage,
    LoginModalPage,
    PaymentsPage,
    TempPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      libraries: ['places'],
      apiKey: environment.googleMapsKey
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    SearchResultPage,
    TripsPage,
    TripDetailPage,
    LoginPage,
    LoginModalPage,
    PaymentsPage,
    TempPage
  ],
  providers: [
    Geolocation,
    GooglePlus,
    StatusBar,
    SplashScreen,
    AutocompleteProvider,
    GeolocationProvider,
    FirestoreProvider,
    AngularFirestore,
    AngularFireDatabase,
    AngularFireAuth,
    AuthService,
    WindowService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GeolocationProvider,
    FirestoreProvider,
    AutocompleteProvider
  ]
})
export class AppModule {}
