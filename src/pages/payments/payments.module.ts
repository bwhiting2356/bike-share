import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentsPage } from './payments';
import { ComponentsModule } from '../../components/components.module';
import { PaymentMethodPageModule } from "../payment-method/payment-method.module";

@NgModule({
  declarations: [
    PaymentsPage,
  ],
  imports: [
    PaymentMethodPageModule,
    ComponentsModule,
    IonicPageModule.forChild(PaymentsPage),
  ],
})
export class PaymentsPageModule {}
