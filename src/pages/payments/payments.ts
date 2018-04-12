import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

type Description = 'No-Show Fee' | 'Trip Booking' | 'Cancellation Credit';

interface Transaction {
  date: Date;
  description: string;
  price: number;
  tripId?: number;
}


@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage {
  transactions: Transaction[] = [
    {
      date: new Date(),
      description: 'No-Show Fee',
      price: -5.00,
      tripId: 8362
    },
    {
      date: new Date(),
      description: 'Booking',
      price: 2.14,
      tripId: 8362
    },
    {
      date: new Date(),
      description: 'Cancellation Credit',
      price: 5.00,
      tripId: 1214
    },
    {
      date: new Date(),
      description: 'Booking',
      price: -4.92,
      tripId: 9937
    },
    {
      date: new Date(),
      description: 'Deposit',
      price: 20,
    },
    {
      date: new Date(),
      description: 'Booking',
      price: 1.14,
      tripId: 1214
    },
    {
      date: new Date(),
      description: 'Withdrawl',
      price: -11.90,
    },
  ];

  balance = {
    cashBalance: 20.14,
    promotion: 10.00
  };

  constructor(
              private toastCtrl: ToastController,
              public navCtrl: NavController,
              public navParams: NavParams) { }

  editPaymentMethod() {
    this.notImplementedYet();
  }

  withdraw() {
    this.notImplementedYet();
  }

  deposit() {
    this.notImplementedYet();
  }

  notImplementedYet() {
    this.toastCtrl.create({
      message: "Sorry, can't do this yet",
      duration: 3000,
      position: 'bottom'
    }).present();

  }



}
