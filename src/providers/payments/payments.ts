import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable()
export class PaymentsProvider {
  private stripe = Stripe(environment.stripeClientId);
  elements: any;

  constructor(public http: HttpClient) {
    this.elements = this.stripe.elements()
  }

  createCardElement(nativeElement: any) {
    const card = this.elements.create('card');
    card.mount(nativeElement);
  }

}
