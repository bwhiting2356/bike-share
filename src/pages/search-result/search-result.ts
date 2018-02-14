import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { fakeResult } from './fakeResult';

/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {

  result;
  constructor(
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.result = fakeResult;
  }

  ionViewDidLoad() {
    // let loading = this.loadingCtrl.create({
    //   content: 'Searching database..'
    // });
    //
    // loading.present();
    console.log('ionViewDidLoad SearchResultPage');
  }

}
