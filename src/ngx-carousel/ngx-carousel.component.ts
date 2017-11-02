import {
  NgxCarouselItemDirective,
  NgxCarouselNextDirective,
  NgxCarouselPrevDirective
} from './ngx-carousel.directive';
import {
  Component,
  ElementRef,
  Renderer,
  Input,
  Output,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  EventEmitter,
  ContentChildren,
  QueryList,
  ViewChild,
  AfterContentInit,
  ViewChildren,
  ContentChild
} from '@angular/core';

import { NgxCarousel, NgxCarouselStore } from './ngx-carousel.interface';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-carousel',
  template: `<div #main class="som"><div #ngxcarousel class="ngxcarousel"><ng-content select="[NgxCarouselPrev]"></ng-content><div class="ngxcarousel-inner"><div #ngxitems class="ngxcarousel-items"><ng-content select="[NgxCarouselItem]"></ng-content></div><div style="clear: both"></div></div><ng-content select="[NgxCarouselNext]"></ng-content></div><div #points *ngIf="userData.point.visible"><ul class="ngxcarouselPoint"><li #pointInner *ngFor="let i of pointNumbers; let i=index" [class.active]="i==pointers" (click)="moveTo(i)"></li></ul></div></div>`,
  styles: [`
    .som {
      width: 100%;
      position: relative;
    }
    .som .ngxcarousel {
      width: 100%;
      position: relative;
    }
    .som .ngxcarousel .ngxcarousel-inner {
      position: relative;
      overflow: hidden;
    }
    .som .ngxcarousel .ngxcarousel-inner .ngxcarousel-items {
      white-space: nowrap;
      position: relative;
    }
    .banner .ngxcarouselPointDefault .ngxcarouselPoint {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }
    .banner .ngxcarouselPointDefault .ngxcarouselPoint li {
      background: rgba(255, 255, 255, 0.55);
    }
    .banner .ngxcarouselPointDefault .ngxcarouselPoint li.active {
      background: white;
    }
    .banner .ngxcarouselPointDefault .ngxcarouselPoint li:hover {
      cursor: pointer;
    }
    .ngxcarouselPointDefault .ngxcarouselPoint {
      list-style-type: none;
      text-align: center;
      padding: 12px;
      margin: 0;
      white-space: nowrap;
      overflow: auto;
      box-sizing: border-box;
    }
    .ngxcarouselPointDefault .ngxcarouselPoint li {
      display: inline-block;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      padding: 4px;
      margin: 0 4px;
      transition-timing-function: cubic-bezier(0.17, 0.67, 0.83, 0.67);
      transition: .4s;
    }
    .ngxcarouselPointDefault .ngxcarouselPoint li.active {
      background: #6b6b6b;
      transform: scale(1.8);
    }
    .ngxcarouselPointDefault .ngxcarouselPoint li:hover {
      cursor: pointer;
    }
  `]
})
export class NgxCarouselComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  pointIndex: number;
  pointers: number;

  // tslint:disable-next-line:no-input-rename
  @Input('inputs') userData: any;

  @Output('carouselLoad') carouselLoad: EventEmitter<any> = new EventEmitter();

  @ContentChildren(NgxCarouselItemDirective) private items: QueryList<NgxCarouselItemDirective>;
  @ViewChildren('pointInner', { read: ElementRef }) private points: QueryList<ElementRef>;

  @ContentChild(NgxCarouselNextDirective, { read: ElementRef }) private next: ElementRef;
  @ContentChild(NgxCarouselPrevDirective, { read: ElementRef }) private prev: ElementRef;

  @ViewChild('ngxcarousel', { read: ElementRef }) private carouselMain1: ElementRef;
  @ViewChild('ngxitems', { read: ElementRef }) private carouselInner1: ElementRef;
  @ViewChild('main', { read: ElementRef }) private carousel1: ElementRef;
  @ViewChild('points', { read: ElementRef }) private pointMain: ElementRef;

  private leftBtn: any;
  private rightBtn: any;
  private evtValue: number;
  private pauseCarousel = false;
  private pauseInterval: any;

  private carousel: any;
  private carouselMain: any;
  private carouselInner: any;
  private carouselItems: any;

  private onResize: any;
  private onScrolling: any;
  private currentSlide = 0;
  private carouselInt: any;

  public Arr1 = Array;
  public pointNumbers: Array<any> = [];
  public data: NgxCarouselStore = {
    type: 'fixed',
    classText: '',
    items: 0,
    load: 0,
    deviceWidth: 0,
    carouselWidth: 0,
    width: 0,
    visibleItems: 0,
    slideItems: 0,
    itemWidthPer: 0,
    transform: { xs: 0, sm: 0, md: 0, lg: 0, all: 0 },
    loop: false,
    dexVal: 0,
    touchTransform: 0,
    touch: { active: false, swipe: '', velocity: 0 },
    isEnd: false,
    isFirst: true,
    isLast: false
  };


  constructor(
    private el: ElementRef,
    private renderer: Renderer,
  ) { }

  ngOnInit() {

    this.carousel = this.carousel1.nativeElement;
    this.carouselMain = this.carouselMain1.nativeElement;
    this.carouselInner = this.carouselInner1.nativeElement;
    this.carouselItems = this.carouselInner.getElementsByClassName('item');

    this.rightBtn = this.next.nativeElement;
    this.leftBtn = this.prev.nativeElement;

    this.data.type = this.userData.grid.all !== 0 ? 'fixed' : 'responsive';
    this.data.loop = this.userData.loop || false;
    this.userData.easing = this.userData.easing || 'cubic-bezier(0, 0, 0.2, 1)';

    this.carouselSize();
    // const datas = this.itemsElements.first.nativeElement.getBoundingClientRect().width;

  }

  ngAfterContentInit() {
    this.renderer.listen(this.leftBtn, 'click', () => this.carouselScrollOne(0));
    this.renderer.listen(this.rightBtn, 'click', () => this.carouselScrollOne(1));
    // this.userData.point.
    // this.pointMain


    const styleItem = document.createElement('style');
    if (!this.carouselInner.querySelectorAll('style').length) {
      this.carouselInner.appendChild(styleItem);
    }

    this.storeCarouselData();
    this.carouselInterval();
    this.onWindowScrolling();
    this.buttonControl();
    this.touch();

    this.carouselPoint();
    this.items.changes.subscribe(val => {
      this.data.isLast = false;
      this.carouselPoint();
      this.buttonControl();
    });
  }

  ngAfterViewInit() {
    if (this.userData.point.pointStyles) {
      const datas = this.userData.point.pointStyles.replace(/.ngxcarouselPoint/g, `.${this.data.classText} .ngxcarouselPoint`);
      // console.log(datas);
      const styleItem = document.createElement('style');
      styleItem.innerHTML = datas;
      this.carousel.appendChild(styleItem);
    } else {
      this.renderer.setElementClass(this.pointMain.nativeElement, 'ngxcarouselPointDefault', true);
    }

  }

  ngOnDestroy() {
    clearInterval(this.carouselInt);
  }


  @HostListener('window:resize', ['$event']) onResizing(event: any) {
    clearTimeout(this.onResize);
    this.onResize = setTimeout(() => {
      // tslint:disable-next-line:no-unused-expression
      this.data.deviceWidth !== event.target.outerWidth && this.storeCarouselData();
    }, 500);
  }

  /* Get Touch input */
  private touch(): void {
    if (this.userData.touch) {
      const hammertime = new Hammer(this.carouselInner);
      hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

      hammertime.on('panstart', (ev: any) => {
        this.data.carouselWidth = this.carouselInner.offsetWidth;

        this.data.touchTransform =
          this.data.deviceType === 'xs' ? this.data.transform.xs :
            this.data.deviceType === 'sm' ? this.data.transform.sm :
              this.data.deviceType === 'md' ? this.data.transform.md :
                this.data.deviceType === 'lg' ? this.data.transform.lg :
                  this.data.transform.all;

        this.data.dexVal = 0;
        this.setStyle(this.carouselInner, 'transition', '');

      });
      hammertime.on('panleft', (ev: any) => {
        this.touchHandling('panleft', ev.deltaX);
      });
      hammertime.on('panright', (ev: any) => {
        this.touchHandling('panright', ev.deltaX);
      });
      hammertime.on('panend', (ev: any) => {
        this.setStyle(this.carouselInner, 'transform', '');
        this.data.touch.velocity = ev.velocity;
        this.data.touch.swipe === 'panright' ? this.carouselScrollOne(0) : this.carouselScrollOne(1);
      });
    }

  }

  /* handle touch input */
  private touchHandling(e: string, ev: number): void {
    ev = Math.abs(ev);
    let valt = ev - this.data.dexVal;
    valt = this.data.type === 'responsive' ? Math.abs(ev - this.data.dexVal) / this.data.carouselWidth * 100 : valt;
    this.data.dexVal = ev;
    this.data.touch.swipe = e;
    this.data.touchTransform = e === 'panleft' ? valt + this.data.touchTransform : this.data.touchTransform - valt;

    if (this.data.touchTransform > 0) {

      this.setStyle(this.carouselInner, 'transform',
        this.data.type === 'responsive' ?
          `translate3d(-${this.data.touchTransform}%, 0px, 0px)` :
          `translate3d(-${this.data.touchTransform}px, 0px, 0px)`);

    } else {
      this.data.touchTransform = 0;
    }
  }

  /* this used to disable the scroll when it is not on the display */
  private onWindowScrolling(): void {
    const top = this.carousel.offsetTop;
    const scrollY = window.scrollY;
    const heightt = window.innerHeight;
    const carouselHeight = this.carousel.offsetHeight;

    if ((top <= scrollY + heightt - carouselHeight / 4) && (top + carouselHeight / 2 >= scrollY)) {
      this.carouselIntervalEvent(0);
    } else {
      this.carouselIntervalEvent(1);
    }

  }

  /* store data based on width of the screen for the carousel */
  private storeCarouselData(): void {
    // console.log(this.carouselMain1);

    this.data.deviceWidth = window.innerWidth;
    this.data.carouselWidth = this.carouselMain.offsetWidth;

    if (this.data.type === 'responsive') {

      this.data.deviceType =
        this.data.deviceWidth >= 1200 ? 'lg' :
          this.data.deviceWidth >= 992 ? 'md' :
            this.data.deviceWidth >= 768 ? 'sm' : 'xs';

      this.data.items = +(
        this.data.deviceWidth >= 1200 ? this.userData.grid.lg :
          this.data.deviceWidth >= 992 ? this.userData.grid.md :
            this.data.deviceWidth >= 768 ? this.userData.grid.sm :
              this.userData.grid.xs);

      this.data.width = this.data.carouselWidth / this.data.items;
    } else {
      this.data.items = Math.trunc(this.data.carouselWidth / this.userData.grid.all);
      this.data.width = this.userData.grid.all;
    }

    this.data.slideItems = +(this.userData.slide < this.data.items ? this.userData.slide : this.data.items);
    this.data.load = this.userData.load >= this.data.slideItems ? this.userData.load : this.data.slideItems;
    this.userData.speed = +(this.userData.speed ? this.userData.speed : 400);

  }

  /* Init carousel point */
  private carouselPoint(): void {
    if (this.data.slideItems === 0) {
      setTimeout(() => {
        this.carouselPoint();
      }, 10);
    } else if (this.userData.point.visible === true) {
      const Nos = this.items.length - (this.data.items - this.data.slideItems);
      // console.log(this.items.length, this.data.items , this.data.slideItems);
      this.pointIndex = Math.ceil(Nos / this.data.slideItems);
      // console.log(Nos, this.data.slideItems);
      const pointers = [];
      for (let i = 0; i < this.pointIndex; i++) {
        pointers.push(i);
      }
      // let sdf = this.Arr1(points).fill(1);
      this.pointNumbers = pointers;
      setTimeout(() => {
        this.carouselPointActiver();
      });
    }
  }

  /* change the active point in carousel */
  private carouselPointActiver(): void {
    // const parent = this.carousel.querySelectorAll('.ngxcarouselPointInner div');
    // const parent = this.points;
    // console.log(this.points);
    if (this.points.length !== 0) {
      const i = Math.ceil(this.currentSlide / this.data.slideItems);
      // for (let j = 0; j < parent.length; j++) {
      //   this.renderer.setElementClass(parent[j], 'active', false);
      // }
      // this.points.forEach(div => {
      //   this.renderer.setElementClass(div.nativeElement, 'active', false);
      // });
      this.pointers = i;
      // this.renderer.setElementClass(this.points._results[i].nativeElement, 'active', true);
    }
  }

  /* this function is used to scoll the carousel when point is clicked */
  public moveTo(index: number) {
    if (this.currentSlide !== index) {
      let slideremains = 0;
      const btns = this.currentSlide < index ? 1 : 0;

      if (index === 0) {
        this.data.isFirst = true;
        this.data.isLast = false;
        slideremains = index * this.data.slideItems;
      } else if (index === this.pointIndex - 1) {
        this.data.isFirst = false;
        this.data.isLast = true;
        slideremains = this.items.length - this.data.items;
      } else {
        this.data.isFirst = false;
        this.data.isLast = false;
        slideremains = index * this.data.slideItems;
      }
      this.carouselScrollTwo(btns, slideremains, this.userData.speed);
    }
  }

  /* set the style of the carousel based the inputs data */
  private carouselSize(): void {

    this.data.classText = this.generateID();
    let dism = '';
    const styleid = '.' + this.data.classText;

    // const btnCss = `position: absolute;margin: auto;top: 0;bottom: 0;width: 50px;height: 50px;
    //                 box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;`;

    // dism += `${styleid} .leftRs {${btnCss}left: 0;} ${styleid} .rightRs {${btnCss}right: 0;}`;



    if (this.userData.custom === 'banner') {
      this.renderer.setElementClass(this.carousel, 'banner', true);
    }

    if (this.userData.animation === 'lazy') {
      dism += `${styleid} .item {transition: transform .6s ease;}`;
    }

    let itemStyle = '';
    if (this.data.type === 'responsive') {

      const itemWidth_xs = this.userData.type === 'mobile' ?
        `${styleid} .item {width: ${95 / this.userData.grid.xs}%}` :
        `${styleid} .item {width: ${100 / this.userData.grid.xs}%}`;

      const itemWidth_sm = styleid + ' .item {width: ' + 100 / this.userData.grid.sm + '%}';
      const itemWidth_md = styleid + ' .item {width: ' + 100 / this.userData.grid.md + '%}';
      const itemWidth_lg = styleid + ' .item {width: ' + 100 / this.userData.grid.lg + '%}';

      itemStyle = `@media (max-width:767px){${itemWidth_xs}}
                    @media (min-width:768px){${itemWidth_sm}}
                    @media (min-width:992px){${itemWidth_md}}
                    @media (min-width:1200px){${itemWidth_lg}}`;
    } else {
      itemStyle = `${styleid} .item {width: ${this.userData.grid.all}px}`;
    }

    this.renderer.setElementClass(this.carousel, this.data.classText, true);
    const styleItem = document.createElement('style');
    styleItem.innerHTML = `${dism} ${itemStyle}`;
    this.carousel.appendChild(styleItem);
  }

  /* logic to scroll the carousel step 1 */
  private carouselScrollOne(Btn: number): void {
    // console.log(this.data.loop, this.data.isFirst, this.data.isLast);

    let itemSpeed = this.userData.speed;
    let translateXval, currentSlide = 0;
    const touchMove = Math.ceil(this.data.dexVal / this.data.width);
    this.setStyle(this.carouselInner, 'transform', '');

    if (Btn === 0) {
      // if ((this.data.loop && !this.data.isFirst) || !this.data.loop) {
      if ((!this.data.loop && !this.data.isFirst) || this.data.loop) {
        const slide = this.data.slideItems * this.pointIndex;

        const currentSlideD = this.currentSlide - this.data.slideItems;
        const MoveSlide = currentSlideD + this.data.slideItems;
        // this.data.isEnd = false;
        this.data.isFirst = false;
        if (this.currentSlide === 0) {
          // if (this.data.loop) { return false; }
          currentSlide = this.items.length - this.data.items;
          itemSpeed = 400;
          // this.data.isEnd = true;
          this.data.isFirst = false;
          this.data.isLast = true;
        } else if (this.data.slideItems >= MoveSlide) {
          currentSlide = translateXval = 0;
          this.data.isFirst = true;
          // this.data.isLast = false;
        } else {
          this.data.isLast = false;
          if (touchMove > this.data.slideItems) {
            currentSlide = this.currentSlide - touchMove;
            itemSpeed = 200;
          } else {
            currentSlide = this.currentSlide - this.data.slideItems;
          }
        }
        this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
      }
    } else {
      if ((!this.data.loop && !this.data.isLast) || this.data.loop) {

        if ((this.items.length <= (this.currentSlide + this.data.items + this.data.slideItems)) && !this.data.isLast) {
          currentSlide = this.items.length - this.data.items;
          // this.data.isEnd = true;
          this.data.isLast = true;
        } else if (this.data.isLast) {
          // if (this.data.loop) { return false; }
          currentSlide = translateXval = 0;
          itemSpeed = 400;
          // this.data.isEnd = false;
          this.data.isLast = false;
          this.data.isFirst = true;
        } else {
          // this.data.isEnd = false;
          this.data.isLast = false;
          this.data.isFirst = false;
          if (touchMove > this.data.slideItems) {
            currentSlide = this.currentSlide + this.data.slideItems + (touchMove - this.data.slideItems);
            itemSpeed = 200;
          } else {
            currentSlide = this.currentSlide + this.data.slideItems;
          }
        }
        this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
      }
    }
    // console.log(this.data.isFirst, this.data.isLast);
    // console.log(this.data.loop, this.data.isFirst, this.data.isLast);


    // cubic-bezier(0.15, 1.04, 0.54, 1.13)

  }

  /* logic to scroll the carousel step 2 */
  private carouselScrollTwo(Btn: number, currentSlide: number, itemSpeed: number): void {
    // console.log(this.currentSlide, currentSlide);

    // tslint:disable-next-line:no-unused-expression
    this.userData.animation === 'lazy' &&
      this.carouselAnimator(Btn, currentSlide + 1, currentSlide + this.data.items, itemSpeed, Math.abs(this.currentSlide - currentSlide));
    if (this.data.dexVal === 0) {
      const first = .5;
      const second = .50;
      // tslint:disable-next-line:max-line-length
      this.setStyle(this.carouselInner, 'transition', `transform ${itemSpeed}ms ${this.userData.easing}`);
    } else {
      const val = Math.abs(this.data.touch.velocity);
      const first = .7 / val < .5 ? .7 / val : .5;
      const second = (2.9 * val / 10 < 1.3) ? (2.9 * val) / 10 : 1.3;
      let somt = Math.floor((this.data.dexVal / val) / this.data.dexVal * (this.data.deviceWidth - this.data.dexVal));
      somt = somt > itemSpeed ? itemSpeed : somt;
      itemSpeed = somt < 200 ? 200 : somt;
      // tslint:disable-next-line:max-line-length
      this.setStyle(this.carouselInner, 'transition', `transform ${itemSpeed}ms ${this.userData.easing}`);
      // this.carouselInner.style.transition = `transform ${itemSpeed}ms cubic-bezier(0.15, 1.04, 0.54, 1.13) `;
      this.data.dexVal = 0;
    }
    this.transformStyle(currentSlide);
    this.currentSlide = currentSlide;
    this.carouselPointActiver();
    this.carouselLoadTrigger();
    this.buttonControl();
  }

  /* set the transform style to scroll the carousel  */
  private transformStyle(slide: number): void {
    let slideCss = '';
    if (this.data.type === 'responsive') {
      this.data.transform.xs = 100 / this.userData.grid.xs * slide;
      this.data.transform.sm = 100 / this.userData.grid.sm * slide;
      this.data.transform.md = 100 / this.userData.grid.md * slide;
      this.data.transform.lg = 100 / this.userData.grid.lg * slide;
      slideCss = `@media (max-width: 767px) {
              .${this.data.classText} .ngxcarousel-items { transform: translate3d(-${this.data.transform.xs}%, 0, 0); } }
            @media (min-width: 768px) {
              .${this.data.classText} .ngxcarousel-items { transform: translate3d(-${this.data.transform.sm}%, 0, 0); } }
            @media (min-width: 992px) {
              .${this.data.classText} .ngxcarousel-items { transform: translate3d(-${this.data.transform.md}%, 0, 0); } }
            @media (min-width: 1200px) {
              .${this.data.classText} .ngxcarousel-items { transform: translate3d(-${this.data.transform.lg}%, 0, 0); } }`;

    } else {
      this.data.transform.all = this.userData.grid.all * slide;
      slideCss = `.${this.data.classText} .ngxcarousel-items { transform: translate3d(-${this.data.transform.all}px, 0, 0);`;
    }
    this.carouselInner.querySelectorAll('style')[0].innerHTML = slideCss;
  }

  /* this will trigger the carousel to load the items */
  private carouselLoadTrigger(): void {
    if (typeof this.userData.load === 'number') {
      // tslint:disable-next-line:no-unused-expression
      (this.items.length - this.data.load) <= (this.currentSlide + this.data.items) &&
        this.carouselLoad.emit(this.currentSlide);
    }
  }

  /* generate Class for each carousel to set specific style */
  private generateID(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `ngxcarousel${text}`;
  }

  /* handle the auto slide */
  private carouselInterval(): void {
    if (typeof this.userData.interval === 'number' && this.data.loop) {

      this.renderer.listen(this.carouselMain, 'touchstart', () => {
        this.carouselIntervalEvent(1);
      });

      this.renderer.listen(this.carouselMain, 'touchend', () => {
        this.carouselIntervalEvent(0);
      });

      this.renderer.listen(this.carouselMain, 'mouseenter', () => {
        this.carouselIntervalEvent(1);
      });

      this.renderer.listen(this.carouselMain, 'mouseleave', () => {
        this.carouselIntervalEvent(0);
      });

      this.renderer.listenGlobal('window', 'scroll', () => {
        clearTimeout(this.onScrolling);
        this.onScrolling = setTimeout(() => {
          this.onWindowScrolling();
        }, 600);
      });

      this.carouselInt = setInterval(() => {
        // tslint:disable-next-line:no-unused-expression
        !this.pauseCarousel && this.carouselScrollOne(1);
      }, this.userData.interval);
    }
  }

  /* pause interval for specific time */
  private carouselIntervalEvent(ev: number): void {
    this.evtValue = ev;
    if (this.evtValue === 0) {
      clearTimeout(this.pauseInterval);
      this.pauseInterval = setTimeout(() => {
        // tslint:disable-next-line:no-unused-expression
        this.evtValue === 0 && (this.pauseCarousel = false);
      }, this.userData.interval);
    } else {
      this.pauseCarousel = true;
    }
  }

  /* animate the carousel items */
  private carouselAnimator(direction: number, start: number, end: number, speed: number, length: number): void {
    let val = length < 5 ? length : 5;
    val = val === 1 ? 3 : val;

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        val = val * 2;
        // tslint:disable-next-line:no-unused-expression
        this.carouselItems[i] && this.setStyle(this.carouselItems[i], 'transform', `translate3d(${val}px, 0, 0)`);
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        val = val * 2;
        // tslint:disable-next-line:no-unused-expression
        this.carouselItems[i] && this.setStyle(this.carouselItems[i], 'transform', `translate3d(-${val}px, 0, 0)`);
      }
    }
    setTimeout(() => {
      for (let i = 0; i < this.items.length; i++) {
        this.setStyle(this.carouselItems[i], 'transform', 'translate3d(0, 0, 0)');
      }
    }, speed * .7);
  }

  /* control button for loop */
  private buttonControl(): void {
    if (!this.data.loop) {
      if (this.data.isFirst) {
        this.setStyle(this.leftBtn, 'display', 'none');
        this.setStyle(this.rightBtn, 'display', 'block');
      }
      if (this.data.isLast) {
        this.setStyle(this.leftBtn, 'display', 'block');
        this.setStyle(this.rightBtn, 'display', 'none');
      }
      if (!this.data.isFirst && !this.data.isLast) {
        this.setStyle(this.leftBtn, 'display', 'block');
        this.setStyle(this.rightBtn, 'display', 'block');
      }
    }
  }

  private setStyle(el: any, prop: any, val: any): void {
    this.renderer.setElementStyle(el, prop, val);
  }

}
