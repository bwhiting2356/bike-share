import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// pages

import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { AddressModalPage } from '../pages/address-modal/address-modal';
import { TripsPage } from '../pages/trips/trips';
import { TripDetailPage } from '../pages/trip-detail/trip-detail';
import { SearchResultPage } from '../pages/search-result/search-result';
import { LoginPage } from '../pages/login/login';
import { TempPage } from '../pages/temp/temp'; // TODO: remove temp page

// services

import { GeolocationService } from '../services/geolocation-service';
import { FirebaseService } from '../services/firebase-service';
import { AutocompleteService } from '../services/autocomplete-service';

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
import { Keyboard } from '@ionic-native/keyboard';
import { GooglePlus } from '@ionic-native/google-plus';

import { environment } from "../environments/environment";
import { AuthService } from '../services/auth-service';
import { FirestoreService } from '../services/firestore-service';
import { LoginModalPage } from '../pages/login-modal/login-modal';



@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    AddressModalPage,
    SearchResultPage,
    TripsPage,
    TripDetailPage,
    TempPage,
    LoginPage,
    LoginModalPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    AddressModalPage,
    SearchResultPage,
    TripsPage,
    TripDetailPage,
    TempPage,
    LoginPage,
    LoginModalPage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    GeolocationService,
    AutocompleteService,
    // FirebaseService,
    FirestoreService,
    Geolocation,
    Keyboard,
    AngularFirestore,
    AngularFireDatabase,
    AngularFireAuth,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
