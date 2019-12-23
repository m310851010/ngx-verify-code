import { NgModule } from '@angular/core';
import { NgxVerifyCodeComponent } from './ngx-verify-code.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [NgxVerifyCodeComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxVerifyCodeComponent]
})
export class NgxVerifyCodeModule { }
