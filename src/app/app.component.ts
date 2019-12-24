import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message: string;
  success() {
    this.message = '验证通过';
  }

  fail() {
    this.message = '验证未通过';
  }

  refresh(autoRefresh: boolean) {
    this.message = (autoRefresh ? '自动' : '手动') + ' 刷新验证码';
  }
}
