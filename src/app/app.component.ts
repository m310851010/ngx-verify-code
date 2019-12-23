import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  success() {
    console.log('验证成功');
  }

  fail() {
    console.log('验证失败');
  }

  refresh() {
    console.log('刷新验证码');
  }


}
