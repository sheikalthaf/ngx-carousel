import { Directive, ElementRef, Renderer, Input, Output, OnInit, HostListener, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[carousel]'
})
export class CarouselDirective {

    @Input() custom: any;
    @Input() items: any;
    @Input() slide: number;
    @Input() interval: number;
    @Input() speed: number;
    @Input() load: number;
    @Input() animation: any;
    @Output() carouselLoad: EventEmitter<any> = new EventEmitter();

    private carousel: any;
    private carouselInner: any;
    private carouselItems: any;
    private styleManager: any = {
      'style': ' .ngxcarousel {width: 100%;position: relative;} .ngxcarousel-inner {overflow-x: hidden;white-space: nowrap;font-size: 0;vertical-align: top;} .ngxcarousel-inner .item {display: inline-block;font-size: 14px;white-space: initial;}.leftRs {position: absolute;margin: auto;top: 0;bottom: 0;z-index: 100;left: 0;width: 50px;height: 50px;box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;}.rightRs {position: absolute; margin: auto; top: 0; right: 0; bottom: 0;z-index: 100; width: 50px;height: 50px; box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;}',
      'point': '.ngxcarouselPoint ul {list-style-type: none;text-align: center;padding: 12px;margin: 0;white-space: nowrap;overflow: auto;} .ngxcarouselPoint li {display: inline-block;border-radius: 50%;background: rgba(0, 0, 0, 0.55);padding: 4px;margin: 0 4px;transition-timing-function: cubic-bezier(.17, .67, .83, .67);transition: .4s;} .ngxcarouselPoint li.active {background: #6b6b6b;transform: scale(1.8);}',
      'animation': {'lazy': '.ngxcarouselLazy .item {transition: .6s ease all;}'},
      'customCss': {'tile':'.ngxcarousel-inner .item .tile {background: white;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);margin: 5px;}',
                    'banner': {'point': '.banner .ngxcarouselPoint li {background: rgba(255, 255, 255, 0.55);}.banner .ngxcarouselPoint li.active {  background: white;}.banner .ngxcarouselPoint {    position: absolute;    width: 100%;    bottom: 20px; }'
                  }
      }
    };
    private itemWidth: number;
    private currentSlide: number;
    private ResResize: any;
    private visibleItems: number;
    private slideItems: number;
    private scrolledItems: number;
    @Output() resPoint: any;

    // @HostBinding() loader;

    constructor(
      private el: ElementRef,
      private renderer: Renderer) {
      // renderer.setElementStyle(el.nativeElement, 'background', 'grey');
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
      this.carousel = this.el.nativeElement;
      this.carouselInner = this.carousel.getElementsByClassName('ngxcarousel-inner')[0];
      this.carouselItems = this.carouselInner.getElementsByClassName('item');
      this.carouselSize();
      this.carousel.querySelector('.rightRs').addEventListener('click', () => { this.carouselScroll(1); });
      this.carousel.querySelector('.leftRs').addEventListener('click', () => { this.carouselScroll(0); });
      this.carouselInner.onscroll = () => {
        this.scrollStart();
      }
    }

    @HostListener('mouseenter') onmouseenter() {
      this.renderer.setElementClass(this.carousel, 'ngxcarouselHovered', true);
    }

    @HostListener('mouseleave') onmouseleave() {
      this.renderer.setElementClass(this.carousel, 'ngxcarouselHovered', false);
    }

    @HostListener('window:resize')
    onResize() {
      // console.log(event);
      clearTimeout(this.ResResize);
      this.ResResize = setTimeout(() => { this.storeResData(); }, 500);
    }

    private storeResData() {
        const windowWidth = window.innerWidth;
        // tslint:disable-next-line:max-line-length
        this.visibleItems = +(windowWidth >= 1200 ? this.items.lg : windowWidth >= 992 ? this.items.md : windowWidth >= 768 ? this.items.sm : this.items.xs);
        this.itemWidth = this.carouselInner.offsetWidth / this.visibleItems;
        this.carouselInner.scrollLeft = this.currentSlide * this.itemWidth;
        this.scrolledItems = Math.round(this.carouselInner.scrollLeft / this.itemWidth);
        this.slideItems = this.slide < this.visibleItems ? this.slide : this.visibleItems;
        this.speed = this.speed ? this.speed : 400;
    }

    private carouselPoint() {
        const Nos = this.carouselItems.length - (this.visibleItems - this.slideItems);
        const p = Math.ceil(Nos / this.slideItems);

        let point = '<div class="ngxcarouselPoint"><ul>'
        for (let i = 0; i < p; i++) {
            if (i === 0) {
                point += '<li class="active"></li>';
            } else {
                point += '<li></li>';
            }
        }
        point += '</ul></div>';
        const respo = this.carousel.querySelectorAll('.ngxcarouselPoint');
        // console.log(!respo.length);
        // tslint:disable-next-line:no-unused-expression
         if (respo.length > 0) {
           for (let i = 0; i <= respo.length; i++) {
             respo[i].remove();
           }
            // respo.parentNode.remove();
         }
        this.carousel.insertAdjacentHTML('beforeend', point);
        // parent.find('.resPoint').remove();
    }

    private scrollStart() {
      const scro = Math.round(this.carouselInner.scrollLeft / this.itemWidth);
      this.carouselPointActive(scro);
      // console.log(scro);
    }

    private carouselPointActive(start: number) {
      // console.log(start);
        const parent = this.carousel.querySelectorAll('.ngxcarouselPoint li');
        const i = Math.ceil(start / this.slideItems);
        if (!parent[i]) { this.carouselPoint(); }
        for (let j = 0; j < parent.length; j++) {
            this.renderer.setElementClass(parent[j], 'active', false);
        }
        this.renderer.setElementClass(parent[i], 'active', true);
    }

    private carouselSize() {
        const itemsSplit = this.items.split('-');
        this.items = {
          'xs': itemsSplit[0],
          'sm': itemsSplit[1],
          'md': itemsSplit[2],
          'lg': itemsSplit[3]
        }
        // const index = + Math.round( Math.random() * (1000 - 10) + 10);
        const id = 'ResSlid' + this.makeid();

        const styleCollector0: string = '.' + id + ' .item {width: ' + 100 / itemsSplit[0] + '%}';
        const styleCollector1: string = '.' + id + ' .item {width: ' + 100 / itemsSplit[1] + '%}';
        const styleCollector2: string = '.' + id + ' .item {width: ' + 100 / itemsSplit[2] + '%}';
        const styleCollector3: string = '.' + id + ' .item {width: ' + 100 / itemsSplit[3] + '%}';

        // tslint:disable-next-line:max-line-length
        console.log((this.custom === 'banner' && ('.' + id + ' ' + this.styleManager.customCss.banner.point)));
        const styleCollector = '<div><style>' +
        this.styleManager.style +
        this.styleManager.point +
        // tslint:disable-next-line:max-line-length
        (typeof this.custom !== 'undefined' && (this.custom === 'banner' && (this.styleManager.customCss.banner.point)) || (this.custom === 'tile' && this.styleManager.customCss.tile)) +
        (this.animation === 'lazy' && this.styleManager.animation.lazy) +
                                            '@media (max-width:767px){.ngxcarousel-inner {overflow-x: auto; }' + styleCollector0 + '}' +
                                            '@media (min-width:768px){' + styleCollector1 + '}' +
                                            '@media (min-width:992px){' + styleCollector2 + '}' +
                                            '@media (min-width:1200px){' + styleCollector3 + '}</style></div>';

        // console.log(styleCollector)
        this.renderer.setElementClass(this.carousel, id, true);
        this.carousel.insertAdjacentHTML('beforeend', styleCollector);
        // tslint:disable-next-line:no-unused-expression
        this.animation === 'lazy' && this.renderer.setElementClass(this.carousel, 'ngxcarouselLazy', true);
        // tslint:disable-next-line:no-unused-expression
        typeof this.interval === 'number' && this.carouselSlide();
        this.storeResData();
        this.carouselPoint();
        // this.carousel('Btn');
    }

    private makeid() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private carouselSlide() {
        setInterval(() => {
           // tslint:disable-next-line:no-unused-expression
    		 !(this.carousel.classList.contains('ngxcarouselHovered')) && this.carouselScroll(1);
        }, this.interval);
    }

    public carouselScroll(Btn: number) {
        // let t0 = performance.now();
        let itemSpeed = +this.speed;
        let translateXval, currentSlide = 0;
        const itemLenght = this.carouselItems.length;
        // const itemWidth = this.carouselItems[0].offsetWidth;
        const divValue = Math.round(this.carouselInner.scrollLeft / this.itemWidth);

        if (Btn === 0) {
            currentSlide = divValue - this.slideItems;
            translateXval = currentSlide * this.itemWidth;
            const MoveSlide = currentSlide + this.slideItems;

            if (divValue === 0) {
                currentSlide = itemLenght - this.slideItems;
                translateXval = currentSlide * this.itemWidth;
                currentSlide = itemLenght - this.visibleItems;
                itemSpeed = 400;
                Btn = 1;
            } else if (this.slideItems >= MoveSlide) {
                currentSlide = translateXval = 0;
            }
        } else {
            currentSlide = divValue + this.slideItems;
            translateXval = currentSlide * this.itemWidth;
            const MoveSlide = currentSlide + this.slideItems;

            if (divValue + this.visibleItems === itemLenght) {
                currentSlide = translateXval = 0;
                itemSpeed = 400;
                Btn = 0;
            } else if (itemLenght <= (MoveSlide - this.slideItems + this.visibleItems)) {
                currentSlide = itemLenght - this.slideItems;
                translateXval = currentSlide * this.itemWidth;
                currentSlide = itemLenght - this.visibleItems;
            }
        }


        // let cons = {
        //   'currentSlide': currentSlide + 1,
        //   'endSlide': currentSlide + this.visibleItems,
        //   'speed': itemSpeed,
        //   'divValue': Math.abs(divValue - currentSlide)
        // }
        // console.log(cons);

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:no-unused-expression
        this.animation === 'lazy' && this.carouselAnimator( Btn, currentSlide + 1, currentSlide + this.visibleItems, itemSpeed, Math.abs(divValue - currentSlide));
        this.currentSlide = currentSlide;
        // tslint:disable-next-line:no-unused-expression
        this.load && this.carouselLoad1();
        this.smoothScoll(translateXval, itemSpeed);
        // this.scrollTo(this.carouselInner, translateXval, itemSpeed);
        // this.carouselPointActive(currentSlide);
        // this.chng.markForCheck();

         // let t1 = performance.now();
         // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    }

    private carouselLoad1() {
      this.load = this.load >= this.slideItems ? this.load : this.slideItems;
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:no-unused-expression
      (this.carouselItems.length - this.load) <= (this.currentSlide + this.visibleItems) && this.carouselLoad.emit(this.currentSlide) && console.log('asd');
    }

    private smoothScoll(obj: number, speed: number) {
        const startX = this.carouselInner.scrollLeft;
        const stopX = obj;
        const distance = stopX > startX ? stopX - startX : startX - stopX;
        // let speed = Math.round(distance / 100);
        //    if (speed >= 20) speed = 20;
        /// const rol = Math.round(distance/speed)*10+10;
        const rol = 13;
        // console.log(rol);
        const step = Math.round(speed / rol);
        const addr = distance / step;
        // let leapX = stopX > startX ? startX + addr : startX - addr;
        let leapX = startX;
          if (stopX > startX) {
              for (let i = 0; i <= speed; i += rol) {
                setTimeout(() => {
                    leapX += addr
                    // console.log(i);
                    if (Math.round(leapX) + 5 >= stopX) { leapX = stopX; }
                    this.carouselInner.scrollLeft = Math.round(leapX);
                    if (leapX === stopX) {return}
                  }, i);
              }
          } else {
              for (let i = 0; i <= speed; i += rol) {
                setTimeout(() => {
                    leapX -= addr
                    if (Math.round(leapX) - 5 <= stopX) { leapX = stopX; }

                    this.carouselInner.scrollLeft = Math.round(leapX);
                    if (leapX === stopX) {return}
                  }, i);
              }
          }
    }

    private carouselAnimator( direction: number, start: number, end: number, speed: number, length: number) {
        let val = length < 5 ? length : 5;
            val = val === 1 ? 3 : val;

        if (direction === 1) {
          for (let i = start - 1; i < end; i++) {
              val = val * 2;
              this.carouselItems[i].style.transform = 'translateX(' + val + 'px)';
          }
        } else {
          for (let i = end - 1; i >= start - 1; i--) {
              val = val * 2;
               this.carouselItems[i].style.transform = 'translateX(-' + val + 'px)';
          }
        }
        setTimeout(() => {
          for (let i = start - 1; i < end; i++) {
            this.carouselItems[i].style.transform = 'translateX(0px)';
          }
        }, speed - 70);
    }
}