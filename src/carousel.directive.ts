import { Directive, ElementRef, Renderer, Input, Output, OnInit, HostListener, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[carousel]'
})
export class CarouselDirective {

    @Input() inputs: any;
    @Output() carouselLoad: EventEmitter<any> = new EventEmitter();

    private carousel: any;
    private carouselInner: any;
    private carouselItems: any;
    private onResize: any;
    private ItemsDetector: any;
    private onScrolling: any;
    private itemPosition: any;
    private carouselData: any = {
      'width': 0,
      'visibleItems': 0,
      'slideItems': 0
    }

    // private itemWidth: number;
    private currentSlide: number;
    // private visibleItems: number;
    // private slideItems: number;

    private styleManager: any = {
      'style': ' .ngxcarousel {width: 100%;position: relative;} .ngxcarousel-inner {overflow-x: hidden;white-space: nowrap;font-size: 0;vertical-align: top;} .ngxcarousel-inner .item {display: inline-block;font-size: 14px;white-space: initial;}.leftRs {position: absolute;margin: auto;top: 0;bottom: 0;z-index: 100;left: 0;width: 50px;height: 50px;box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;}.rightRs {position: absolute; margin: auto; top: 0; right: 0; bottom: 0;z-index: 100; width: 50px;height: 50px; box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;}',
      'point': '.ngxcarouselPoint ul {list-style-type: none;text-align: center;padding: 12px;margin: 0;white-space: nowrap;overflow: auto;} .ngxcarouselPoint li {display: inline-block;border-radius: 50%;background: rgba(0, 0, 0, 0.55);padding: 4px;margin: 0 4px;transition-timing-function: cubic-bezier(.17, .67, .83, .67);transition: .4s;} .ngxcarouselPoint li.active {background: #6b6b6b;transform: scale(1.8);}',
      'animation': {'lazy': '.ngxcarouselLazy .item {transition: .6s ease all;}'},
      'customCss': {'tile':'.ngxcarousel-inner .item .tile {background: white;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);margin: 5px;}',
                    'banner': {'point': '.banner .ngxcarouselPoint li {background: rgba(255, 255, 255, 0.55);}.banner .ngxcarouselPoint li.active {  background: white;}.banner .ngxcarouselPoint {    position: absolute;    width: 100%;    bottom: 20px; }'
                  }
      }
    };



    constructor(
      private el: ElementRef,
      private renderer: Renderer) {
      // renderer.setElementStyle(el.nativeElement, 'background', 'grey');
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
      // let t0 = performance.now();
      this.carousel = this.el.nativeElement;
      this.carouselInner = this.carousel.getElementsByClassName('ngxcarousel-inner')[0];
      this.carouselItems = this.carouselInner.getElementsByClassName('item');
      this.carousel.querySelector('.rightRs').addEventListener('click', () => { this.carouselScroll(1); });
      this.carousel.querySelector('.leftRs').addEventListener('click', () => { this.carouselScroll(0); });
      const itemsSplit = this.inputs.items.split('-');
        this.inputs.items = {
          'xs': itemsSplit[0],
          'sm': itemsSplit[1],
          'md': itemsSplit[2],
          'lg': itemsSplit[3]
        }
      this.carouselSize()
      this.storeResData();
      if (this.inputs.point === true) {
          this.carouselPoint();
          this.carouselInner.onscroll = () => {
            this.scrollStart();
          }
          this.carouselInner.addEventListener('DOMNodeInserted', () => {
          clearTimeout(this.ItemsDetector);
          this.ItemsDetector = setTimeout(() => { this.carouselPoint() }, 500);
        });
      }
      // let t1 = performance.now();
      // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    }

    @HostListener('mouseenter')
    onmouseenter() {
       this.renderer.setElementClass(this.carousel, 'ngxcarouselHovered', true);
    }

    @HostListener('mouseleave')
    onmouseleave() {
       this.renderer.setElementClass(this.carousel, 'ngxcarouselHovered', false);
    }

    @HostListener('window:resize')
    onResizing() {
      clearTimeout(this.onResize);
      this.onResize = setTimeout(() => { this.storeResData(); }, 500);
    }

    @HostListener('window:scroll')
    onWindowScrolling() {
      clearTimeout(this.onScrolling);
      this.onScrolling = setTimeout(() => {
        const top = this.carousel.offsetTop;
        const scrollY = window.scrollY;
        const heightt = window.innerHeight;
        const carouselHeight = this.carousel.offsetHeight;
        if ((top <= scrollY + heightt - carouselHeight / 4) && (top + carouselHeight / 2 >= scrollY)) {
          this.renderer.setElementClass(this.el.nativeElement, 'ngxcarouselScrolled', false);
        } else {
          this.renderer.setElementClass(this.el.nativeElement, 'ngxcarouselScrolled', true);
        }
      }, 800);

    }

    private scrollStart() {
      clearTimeout(this.itemPosition);
      this.itemPosition = setTimeout(() => {
        const scroll = this.carouselInner.scrollLeft;
        const itm = Math.round(scroll / this.carouselData.width);
        const left = itm * this.carouselData.width;
        // tslint:disable-next-line:no-unused-expression
        scroll !== left && this.smoothScoll(left, 200);
        this.carouselPointActive();
      }, 400);
    }

    private storeResData() {
        const w = window.innerWidth;
        // tslint:disable-next-line:max-line-length
        this.carouselData.items = +(w >= 1200 ? this.inputs.items.lg : w >= 992 ? this.inputs.items.md : w >= 768 ? this.inputs.items.sm : this.inputs.items.xs);
        this.carouselData.width = this.carouselInner.offsetWidth / this.carouselData.items;
        this.carouselInner.scrollLeft = this.currentSlide * this.carouselData.width;
        this.carouselData.slideItems = +(this.inputs.slide < this.carouselData.items ? this.inputs.slide : this.carouselData.items);
        this.inputs.speed = +(this.inputs.speed ? this.inputs.speed : 400);
    }

    private carouselPoint() {
        const Nos = this.carouselItems.length - (this.carouselData.items - this.carouselData.slideItems);
        const p = Math.ceil(Nos / this.carouselData.slideItems);
        console.log(this.carouselData.items +","+ this.carouselData.slideItems);
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:no-unused-expression
        this.carousel.querySelectorAll('.ngxcarouselPoint').length === 0 && this.carousel.insertAdjacentHTML('beforeend', '<div class="ngxcarouselPoint"></div>')
        let point = '<ul>'
        for (let i = 0; i < p; i++) {
                point += '<li></li>';
        }
        point += '</ul>';
        const respo = this.carousel.querySelectorAll('.ngxcarouselPoint')[0];
        respo.innerHTML = '';
        respo.insertAdjacentHTML('beforeend', point);
        this.carouselPointActive();
    }

    private carouselPointActive() {
        const parent = this.carousel.querySelectorAll('.ngxcarouselPoint li');
        if ( parent.length !== 0) {
          const start = Math.round(this.carouselInner.scrollLeft / this.carouselData.width);
          const i = Math.ceil(start / this.carouselData.slideItems);
          for (let j = 0; j < parent.length; j++) {
              this.renderer.setElementClass(parent[j], 'active', false);
          }
          this.renderer.setElementClass(parent[i], 'active', true);
        }
    }

    private carouselSize() {
        const t0 = performance.now();
        // const index = + Math.round( Math.random() * (1000 - 10) + 10);
        const id = 'ResSlid' + this.makeid();

        const styleCollector0: string = '.' + id + ' .item {width: ' + 100 / this.inputs.items.xs + '%}';
        const styleCollector1: string = '.' + id + ' .item {width: ' + 100 / this.inputs.items.sm + '%}';
        const styleCollector2: string = '.' + id + ' .item {width: ' + 100 / this.inputs.items.md + '%}';
        const styleCollector3: string = '.' + id + ' .item {width: ' + 100 / this.inputs.items.lg + '%}';

        let dism = '';
        if (typeof this.inputs.custom !== 'undefined' && this.inputs.custom === 'banner') {
          dism += this.styleManager.customCss.banner.point
        }
        if (typeof this.inputs.custom !== 'undefined' && this.inputs.custom === 'tile') {
          dism += this.styleManager.customCss.tile
        }
        if (typeof this.inputs.animation !== 'undefined' && this.inputs.animation === 'lazy') {
          dism += this.styleManager.animation.lazy
          this.renderer.setElementClass(this.carousel, 'ngxcarouselLazy', true);
        }

        const styleCollector = '<div><style>' +
        this.styleManager.style +
        this.styleManager.point +
        dism +
                      '@media (max-width:767px){.ngxcarousel-inner {overflow-x: auto; }' + styleCollector0 + '}' +
                      '@media (min-width:768px){' + styleCollector1 + '}' +
                      '@media (min-width:992px){' + styleCollector2 + '}' +
                      '@media (min-width:1200px){' + styleCollector3 + '}</style></div>';

        this.renderer.setElementClass(this.carousel, id, true);
        this.carousel.insertAdjacentHTML('beforeend', styleCollector);
        this.carouselSlide();
        setTimeout(() => {
          this.storeResData();
        }, 20);
        const t1 = performance.now();
        console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
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
      if (this.inputs.interval !== '') {
        setInterval(() => {
    		  // tslint:disable-next-line:max-line-length
    		  // tslint:disable-next-line:no-unused-expression
           !(this.carousel.classList.contains('ngxcarouselHovered')) && !(this.carousel.classList.contains('ngxcarouselScrolled')) && this.carouselScroll(1);
        }, +(this.inputs.interval));
      }
    }

    private carouselScroll(Btn: number) {
        const t0 = performance.now();
        let itemSpeed = +this.inputs.speed;
        let translateXval, currentSlide = 0;
        const itemLenght = this.carouselItems.length;
        const divValue = Math.round(this.carouselInner.scrollLeft / this.carouselData.width);

        if (Btn === 0) {
            currentSlide = divValue - this.carouselData.slideItems;
            translateXval = currentSlide * this.carouselData.width;
            const MoveSlide = currentSlide + this.carouselData.slideItems;

            if (divValue === 0) {
                currentSlide = itemLenght - this.carouselData.slideItems;
                translateXval = currentSlide * this.carouselData.width;
                currentSlide = itemLenght - this.carouselData.items;
                itemSpeed = 400;
                Btn = 1;
            } else if (this.carouselData.slideItems >= MoveSlide) {
                currentSlide = translateXval = 0;
            }
        } else {
            currentSlide = divValue + this.carouselData.slideItems;
            translateXval = currentSlide * this.carouselData.width;
            const MoveSlide = currentSlide + this.carouselData.slideItems;

            if (divValue + this.carouselData.items === itemLenght) {
                currentSlide = translateXval = 0;
                itemSpeed = 400;
                Btn = 0;
            } else if (itemLenght <= (MoveSlide - this.carouselData.slideItems + this.carouselData.items)) {
                currentSlide = itemLenght - this.carouselData.slideItems;
                translateXval = currentSlide * this.carouselData.width;
                currentSlide = itemLenght - this.carouselData.items;
            }
        }
        // console.log(this.carouselInner.offsetWidth +","+ this.carouselData.items +","+ translateXval +","+ this.carouselData.width);
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:no-unused-expression
        this.inputs.animation === 'lazy' && this.carouselAnimator( Btn, currentSlide + 1, currentSlide + this.carouselData.items, itemSpeed, Math.abs(divValue - currentSlide));
        this.currentSlide = currentSlide;
        this.carouselLoad1();
        this.smoothScoll(translateXval, itemSpeed);

        const t1 = performance.now();
        // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    }

    private carouselLoad1() {
      if (this.inputs.load !== '') {
        this.inputs.load = this.inputs.load >= this.carouselData.slideItems ? this.inputs.load : this.carouselData.slideItems;
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:no-unused-expression
        (this.carouselItems.length - this.inputs.load) <= (this.currentSlide + this.carouselData.items) && this.carouselLoad.emit(this.currentSlide);
      }
    }

    private easeinq(t: number) {
      // return t<.5 ? 2*t*t : -1+(4-2*t)*t;
    }

    private smoothScoll(travel: number, speed: number) {
        // console.log(travel);
        const startX = this.carouselInner.scrollLeft;
        const stopX = travel;
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
                    // console.log(this.easeinq(leapX)+","+leapX);
                    leapX += addr
                    if (Math.round(leapX) + 5 >= stopX) { leapX = stopX;   }
                    this.carouselInner.scrollLeft = Math.round(leapX);
                    if (leapX === stopX) {return}
                  }, i);
              }
          } else {
              for (let i = 0; i <= speed; i += rol) {
                setTimeout(() => {
                    leapX -= addr
                    if (Math.round(leapX) - 5 <= stopX) { leapX = stopX;  }
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
