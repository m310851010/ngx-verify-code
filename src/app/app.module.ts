import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxVerifyCodeModule} from '../../projects/ngx-verify-code/src/lib/ngx-verify-code.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxVerifyCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
