import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// pages

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { AddressModalPage } from '../pages/address-modal/address-modal';
import { TripsPage } from '../pages/trips/trips';
import { TripDetailPage } from '../pages/trip-detail/trip-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


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
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from "angularfire2/auth";

// providers

import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';

import { environment } from "../environments/environment";
import { SearchResultPage } from '../pages/search-result/search-result';






@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MapPage,
    AddressModalPage,
    SearchResultPage,
    TripsPage,
    TripDetailPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MapPage,
    AddressModalPage,
    SearchResultPage,
    TripsPage,
    TripDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GeolocationService,
    AutocompleteService,
    FirebaseService,
    Geolocation,
    Keyboard,
    AngularFirestore,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
