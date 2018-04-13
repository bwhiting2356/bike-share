import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentsProvider } from "../../providers/payments/payments";

/**
 * Generated class for the PaymentMethodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethodPage implements AfterViewInit {
  @ViewChild('cardElement') cardElement: ElementRef;

  constructor(
    private payments: PaymentsProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ngAfterViewInit() {
    this.payments.createCardElement(this.cardElement.nativeElement);
  }

}
