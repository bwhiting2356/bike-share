import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule
} from '@angular/material';
import { NgModule } from "@angular/core";

@NgModule({
  imports: [MatNativeDateModule, MatOptionModule, MatInputModule, MatSelectModule, MatDatepickerModule],
  exports: [MatNativeDateModule, MatOptionModule, MatInputModule, MatSelectModule, MatDatepickerModule]
})
export class MaterialModule { }
