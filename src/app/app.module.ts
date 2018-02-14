import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// pages

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { AddressModalPage } from '../pages/address-modal/address-modal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// services
import { GeolocationService } from '../services/geolocation-service';
import { FirebaseService } from '../services/firebase-service';
import { AutocompleteService } from '../services/autocomplete-service';

// firebase

import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from "angularfire2/auth";

import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';

import { ComponentsModule } from "../components/components.module";

import { environment } from "../environments/environment";
import { SearchResultPage } from '../pages/search-result/search-result';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MapPage,
    AddressModalPage,
    SearchResultPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
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
    SearchResultPage
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
