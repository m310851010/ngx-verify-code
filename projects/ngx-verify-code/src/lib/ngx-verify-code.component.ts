import {
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input, OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'ngx-verify-code',
  templateUrl: 'ngx-verify-code.component.html',
  styleUrls: ['ngx-verify-code.component.less'],
})
export class NgxVerifyCodeComponent implements OnInit, OnDestroy {
  /**
   * 画布宽度
   */
  @Input() width = 310;
  /**
   * 画布高度
   */
  @Input() height = 155;
  /**
   * 获取图片地址
   */
  @Input() getImageUrl: (width: number, height: number) => string;
  /**
   * 验证成功回调
   */
  @Output() success: EventEmitter<void> = new EventEmitter<void>();
  /**
   * 验证失败回调
   */
  @Output() fail: EventEmitter<void> = new EventEmitter<void>();
  /**
   * 触发刷新事件, 参数为是否为自动刷新, false: 手动刷新
   */
  @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('canvasRef') canvasRef: ElementRef;
  @ViewChild('blockRef') blockRef: ElementRef;

  /**
   * 滑块半径
   */
  private readonly r = 9;
  /**
   * 滑块边长
   */
  private readonly sliderLength = 42;
  private readonly PI = Math.PI;
  private readonly L = this.sliderLength + this.r * 2 + 3;
  private canvasCtx: CanvasRenderingContext2D;
  private blockCtx: CanvasRenderingContext2D;
  private codeX: number;
  private originX: number;
  private originY: number;
  /**
   * 拖动轨迹
   */
  private trail: number[] = [];
  /**
   * 拖动的X距离
   */
  moveX: number ;
  /**
   * 鼠标左键是否按下
   */
  isMouseDown = false;
  /**
   * 拼图验证码Left值
   */
  blockLeft: number;
  /**
   * 拼图验证码的宽度
   */
  blockWidth = this.width;
  /**
   * 是否验证成功
   */
  verifySuccess: boolean;
  /**
   * 是否处于加载状态
   */
  loading = false;

  constructor(protected render: Renderer2) {
    this.getImageUrl = (w, h) => `https://picsum.photos/${w}/${h}/?image=${this.getRandomByRange(0, 1084)}`;
  }

  ngOnInit() {
    this.canvasCtx = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.blockCtx = (this.blockRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.reset();
    this.render.listen('document', 'mousemove', this.dragMoveHandle.bind(this));
    this.render.listen('document', 'touchmove', this.dragMoveHandle.bind(this));
    this.render.listen('document', 'mouseup', this.dragEndHandle.bind(this));
    this.render.listen('document', 'touchend', this.dragEndHandle.bind(this));
  }

  /**
   * 重置
   * @param autoRefresh 是否是自动刷新
   */
  reset(autoRefresh: boolean = true): void {
    this.loading = true;
    this.verifySuccess = null;
    this.blockWidth = this.width;
    this.blockRef.nativeElement.width = this.width;
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    this.blockCtx.clearRect(0, 0, this.width, this.height);
    this.blockLeft = 0;
    this.moveX = 0;

    this.refresh.emit(autoRefresh);

    this.createImage(evt => {
      this.loading = false;
      // 随机创建滑块的位置
      this.codeX = this.getRandomByRange(this.L + 10, this.width - (this.L + 10));
      const y = this.getRandomByRange(10 + this.r * 2, this.height - (this.L + 10));
      this.draw(this.canvasCtx, this.codeX, y, ctx => ctx.fill());
      this.draw(this.blockCtx, this.codeX, y, ctx => ctx.clip());
      this.canvasCtx.drawImage(evt, 0, 0, this.width, this.height);
      this.blockCtx.drawImage(evt, 0, 0, this.width, this.height);

      const yy = y - this.r * 2 - 1;
      const ImageData = this.blockCtx.getImageData(this.codeX - 3, yy, this.L, this.L);
      this.blockRef.nativeElement.width = this.L;
      this.blockCtx.putImageData(ImageData, 0, yy);
    });
  }

  /**
   * 绘制拼图图标
   * @param ctx CanvasContext对象
   * @param x x坐标
   * @param y x坐标
   * @param operation 操作回调
   */
  protected draw(ctx: CanvasRenderingContext2D, x: number, y: number, operation?: (ctx: CanvasRenderingContext2D) => void) {
    ctx.beginPath();
    // left
    ctx.moveTo(x, y);
    ctx.arc(x + this.sliderLength / 2, y - this.r + 2, this.r, 0.72 * this.PI, 2.26 * this.PI);
    ctx.lineTo(x + this.sliderLength, y);
    // right
    ctx.arc(x + this.sliderLength + this.r - 2, y + this.sliderLength / 2, this.r, 1.21 * this.PI, 2.78 * this.PI);
    ctx.lineTo(x + this.sliderLength, y + this.sliderLength);
    ctx.lineTo(x, y + this.sliderLength);
    // bottom
    ctx.arc(x + this.r - 2, y + this.sliderLength / 2, this.r + 0.4, 2.76 * this.PI, 1.24 * this.PI, true);
    ctx.lineTo(x, y);
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();
    if (operation) {
      operation(ctx);
    }
    ctx.globalCompositeOperation = 'destination-over';
  }

  /**
   * 创建Image
   * @param onload 图片加载成功的回调
   */
  private createImage(onload: (evt: HTMLImageElement) => any) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => onload(img);
    img.onerror = () => img.src = this.getImageUrl(this.width, this.height);
    img.src = this.getImageUrl(this.width, this.height);
  }

  @HostListener('selectstart', ['$event.target'])
  selectStart(el: HTMLElement) {
    return false;
  }

  /**
   * 刷新按钮点击时间
   */
  refreshClick() {
    if (this.loading || this.verifySuccess) {
        return ;
    }
    this.reset(false);
  }

  /**
   * 拖拽开始的处理
   * @param evt 事件,兼容移动端和PC
   */
  dragStartHandle(evt: MouseEvent & TouchEvent) {
    if (this.loading || this.verifySuccess) {
      return ;
    }
    this.originX = evt.clientX || evt.touches[0].clientX;
    this.originY = evt.clientY || evt.touches[0].clientY;
    this.isMouseDown = true;
  }

  /**
   * 拖拽移动的处理
   * @param evt 事件,兼容移动端和PC
   */
  protected dragMoveHandle(evt: MouseEvent & TouchEvent) {
    if (!this.isMouseDown) {
      return false;
    }

    const eventX = evt.clientX || evt.touches[0].clientX;
    const eventY = evt.clientY || evt.touches[0].clientY;
    const moveX = eventX - this.originX;
    const moveY = eventY - this.originY;

    if (moveX < 0 || moveX + 38 >= this.width) {
      return false;
    }

    this.moveX = moveX;
    this.blockLeft = (this.width - 40 - 20) / (this.width - 40) * moveX;
    this.trail.push(moveY);
  }

  /**
   * 拖拽结束的处理
   * @param evt 事件,兼容移动端和PC
   */
  protected dragEndHandle(evt: TouchEvent & MouseEvent) {
    if (!this.isMouseDown) {
      return false;
    }

    this.isMouseDown = false;
    const eventX = evt.clientX || evt.changedTouches[0].clientX;
    if (eventX === this.originX) {
      return false;
    }

    const { spliced, verified } = this.verify();
    if (spliced && verified) {
        this.verifySuccess = true;
        this.success.emit();
        return;
    }
    this.verifySuccess = false;
    this.fail.emit();
    setTimeout(() => {
      this.verifySuccess = null;
      this.reset();
    }, 1500);
  }

  /**
   * 验证结果
   */
  verify(): {spliced: boolean, verified: boolean} {
    const sum = (x, y) => x + y;
    const average = this.trail.reduce(sum, 0) / this.trail.length;
    const deviations = this.trail.map(x => x - average);
    const stddev = Math.sqrt(deviations.map(x => x * x).reduce(sum, 0) / this.trail.length);

    this.trail = [];
    return {
      // x轴验证结果
      spliced: Math.abs(this.blockLeft - this.codeX) < 3,
      // y轴验证结果
      verified: stddev !== 0
    };
  }

  ngOnDestroy(): void {
    this.render.destroy();
  }

  /**
   * 获取图片id,从范围中随机
   * @param start 开始
   * @param end 结束
   * @return 返回随机值
   */
  private getRandomByRange(start, end): number {
    return Math.round(Math.random() * (end - start) + start);
  }
}
