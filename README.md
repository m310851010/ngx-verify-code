## ngx-verify-code

`angular`滑动验证码组件


### 安装

```shell
npm install ngx-verify-code --save
```

### 用法

1. 添加到`NgModule`

```typescript
@NgModule({
imports: [NgxVerifyCodeModule]
})
```

2. 使用组件

```html
<ngx-verify-code
[width]="310"
[height]="155"
[getImageUrl]="getImageUrl"
(success)="success()"
(fail)="fail()"
(refresh)="refresh()">

</ngx-verify-code>
```

### 注意

> 本组件为纯前端验证不能保证安全性 
