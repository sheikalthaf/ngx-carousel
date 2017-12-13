import { NgxCarouselItemDirective, NgxCarouselNextDirective, NgxCarouselPrevDirective } from './ngx-carousel.directive';
import { Component, ElementRef, Renderer, Input, Output, HostListener, EventEmitter, ContentChildren, ViewChild, ViewChildren, ContentChild } from '@angular/core';
import * as Hammer from 'hammerjs';
var NgxCarouselComponent = (function () {
    function NgxCarouselComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.carouselLoad = new EventEmitter();
        this.onMove = new EventEmitter();
        this.afterCarouselViewed = new EventEmitter();
        this.pauseCarousel = false;
        this.Arr1 = Array;
        this.pointNumbers = [];
        this.data = {
            type: 'fixed',
            classText: '',
            deviceType: 'lg',
            items: 0,
            load: 0,
            deviceWidth: 0,
            carouselWidth: 0,
            itemWidth: 0,
            visibleItems: { start: 0, end: 0 },
            slideItems: 0,
            itemWidthPer: 0,
            itemLength: 0,
            currentSlide: 0,
            easing: 'cubic-bezier(0, 0, 0.2, 1)',
            speed: 400,
            transform: { xs: 0, sm: 0, md: 0, lg: 0, all: 0 },
            loop: false,
            dexVal: 0,
            touchTransform: 0,
            touch: { active: false, swipe: '', velocity: 0 },
            isEnd: false,
            isFirst: true,
            isLast: false
        };
    }
    NgxCarouselComponent.prototype.ngOnInit = function () {
        this.carousel = this.el.nativeElement;
        this.carouselMain = this.carouselMain1.nativeElement;
        this.carouselInner = this.carouselInner1.nativeElement;
        this.carouselItems = this.carouselInner.getElementsByClassName('item');
        this.rightBtn = this.next.nativeElement;
        this.leftBtn = this.prev.nativeElement;
        this.data.type = this.userData.grid.all !== 0 ? 'fixed' : 'responsive';
        this.data.loop = this.userData.loop || false;
        this.data.easing = this.userData.easing || 'cubic-bezier(0, 0, 0.2, 1)';
        this.data.touch.active = this.userData.touch || false;
        this.carouselSize();
        // const datas = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    };
    NgxCarouselComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.renderer.listen(this.leftBtn, 'click', function () {
            return _this.carouselScrollOne(0);
        });
        this.renderer.listen(this.rightBtn, 'click', function () {
            return _this.carouselScrollOne(1);
        });
        this.carouselCssNode = this.renderer.createElement(this.carousel, 'style');
        this.storeCarouselData();
        this.carouselInterval();
        this.onWindowScrolling();
        this.buttonControl();
        this.touch();
        this.itemsSubscribe = this.items.changes.subscribe(function (val) {
            _this.data.isLast = false;
            _this.carouselPoint();
            _this.buttonControl();
        });
        // tslint:disable-next-line:no-unused-expression
        this.moveToSlide && this.moveTo(this.moveToSlide);
    };
    NgxCarouselComponent.prototype.ngAfterViewInit = function () {
        if (this.userData.point.pointStyles) {
            var datas = this.userData.point.pointStyles.replace(/.ngxcarouselPoint/g, "." + this.data.classText + " .ngxcarouselPoint");
            var pointNode = this.renderer.createElement(this.carousel, 'style');
            this.renderer.createText(pointNode, datas);
        }
        else if (this.userData.point && this.userData.point.visible) {
            this.renderer.setElementClass(this.pointMain.nativeElement, 'ngxcarouselPointDefault', true);
        }
        this.afterCarouselViewed.emit(this.data);
    };
    NgxCarouselComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.carouselInt);
        // tslint:disable-next-line:no-unused-expression
        this.itemsSubscribe && this.itemsSubscribe.unsubscribe();
    };
    NgxCarouselComponent.prototype.onResizing = function (event) {
        var _this = this;
        clearTimeout(this.onResize);
        this.onResize = setTimeout(function () {
            // tslint:disable-next-line:no-unused-expression
            _this.data.deviceWidth !== event.target.outerWidth &&
                _this.storeCarouselData();
        }, 500);
    };
    NgxCarouselComponent.prototype.ngOnChanges = function (changes) {
        // tslint:disable-next-line:no-unused-expression
        this.moveToSlide > -1 &&
            this.moveTo(changes.moveToSlide.currentValue);
    };
    /* store data based on width of the screen for the carousel */
    NgxCarouselComponent.prototype.storeCarouselData = function () {
        this.data.deviceWidth = window.innerWidth;
        this.data.carouselWidth = this.carouselMain.offsetWidth;
        // const datas = this.items.first.nativeElement.getBoundingClientRect().width;
        if (this.data.type === 'responsive') {
            this.data.deviceType =
                this.data.deviceWidth >= 1200
                    ? 'lg'
                    : this.data.deviceWidth >= 992
                        ? 'md'
                        : this.data.deviceWidth >= 768 ? 'sm' : 'xs';
            this.data.items = this.userData.grid[this.data.deviceType];
            this.data.itemWidth = this.data.carouselWidth / this.data.items;
        }
        else {
            this.data.items = Math.trunc(this.data.carouselWidth / this.userData.grid.all);
            this.data.itemWidth = this.userData.grid.all;
            this.data.deviceType = 'all';
        }
        this.data.slideItems = +(this.userData.slide < this.data.items
            ? this.userData.slide
            : this.data.items);
        this.data.load =
            this.userData.load >= this.data.slideItems
                ? this.userData.load
                : this.data.slideItems;
        this.data.speed =
            this.userData.speed || this.userData.speed > -1
                ? this.userData.speed
                : 400;
        this.carouselPoint();
    };
    /* Get Touch input */
    NgxCarouselComponent.prototype.touch = function () {
        var _this = this;
        if (this.data.touch.active) {
            var hammertime = new Hammer(this.forTouch.nativeElement);
            hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammertime.on('panstart', function (ev) {
                _this.data.carouselWidth = _this.carouselInner.offsetWidth;
                _this.data.touchTransform = _this.data.transform[_this.data.deviceType];
                _this.data.dexVal = 0;
                _this.setStyle(_this.carouselInner, 'transition', '');
            });
            hammertime.on('panleft', function (ev) {
                _this.touchHandling('panleft', ev);
            });
            hammertime.on('panright', function (ev) {
                _this.touchHandling('panright', ev);
            });
            hammertime.on('panend', function (ev) {
                // this.setStyle(this.carouselInner, 'transform', '');
                _this.data.touch.velocity = ev.velocity;
                _this.data.touch.swipe === 'panright'
                    ? _this.carouselScrollOne(0)
                    : _this.carouselScrollOne(1);
            });
            hammertime.on("hammer.input", function (ev) {
                // allow nested touch events to no propagate, this may have other side affects but works for now.
                // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
                ev.srcEvent.stopPropagation();
            });
        }
    };
    /* handle touch input */
    NgxCarouselComponent.prototype.touchHandling = function (e, ev) {
        // vertical touch events seem to cause to panstart event with an odd delta
        // and a center of {x:0,y:0} so this will ignore them
        if (ev.center.x === 0) {
            return;
        }
        ev = Math.abs(ev.deltaX);
        var valt = ev - this.data.dexVal;
        valt =
            this.data.type === 'responsive'
                ? Math.abs(ev - this.data.dexVal) / this.data.carouselWidth * 100
                : valt;
        this.data.dexVal = ev;
        this.data.touch.swipe = e;
        this.data.touchTransform =
            e === 'panleft'
                ? valt + this.data.touchTransform
                : this.data.touchTransform - valt;
        if (this.data.touchTransform > 0) {
            this.setStyle(this.carouselInner, 'transform', this.data.type === 'responsive'
                ? "translate3d(-" + this.data.touchTransform + "%, 0px, 0px)"
                : "translate3d(-" + this.data.touchTransform + "px, 0px, 0px)");
        }
        else {
            this.data.touchTransform = 0;
        }
    };
    /* this used to disable the scroll when it is not on the display */
    NgxCarouselComponent.prototype.onWindowScrolling = function () {
        var top = this.carousel.offsetTop;
        var scrollY = window.scrollY;
        var heightt = window.innerHeight;
        var carouselHeight = this.carousel.offsetHeight;
        if (top <= scrollY + heightt - carouselHeight / 4 &&
            top + carouselHeight / 2 >= scrollY) {
            this.carouselIntervalEvent(0);
        }
        else {
            this.carouselIntervalEvent(1);
        }
    };
    /* Init carousel point */
    NgxCarouselComponent.prototype.carouselPoint = function () {
        // if (this.userData.point.visible === true) {
        var Nos = this.items.length - (this.data.items - this.data.slideItems);
        this.pointIndex = Math.ceil(Nos / this.data.slideItems);
        var pointers = [];
        if (this.pointIndex > 1 || !this.userData.point.hideOnSingleSlide) {
            for (var i = 0; i < this.pointIndex; i++) {
                pointers.push(i);
            }
        }
        this.pointNumbers = pointers;
        this.carouselPointActiver();
        if (this.pointIndex <= 1) {
            this.btnBoolean(1, 1);
            // this.data.isFirst = true;
            // this.data.isLast = true;
        }
        else {
            if (this.data.currentSlide === 0 && !this.data.loop) {
                this.btnBoolean(1, 0);
            }
            else {
                this.btnBoolean(0, 0);
            }
        }
        this.buttonControl();
        // }
    };
    /* change the active point in carousel */
    NgxCarouselComponent.prototype.carouselPointActiver = function () {
        var i = Math.ceil(this.data.currentSlide / this.data.slideItems);
        this.pointers = i;
    };
    /* this function is used to scoll the carousel when point is clicked */
    NgxCarouselComponent.prototype.moveTo = function (index) {
        if (this.pointers !== index && index < this.pointIndex) {
            var slideremains = 0;
            var btns = this.data.currentSlide < index ? 1 : 0;
            if (index === 0) {
                this.btnBoolean(1, 0);
                slideremains = index * this.data.slideItems;
            }
            else if (index === this.pointIndex - 1) {
                this.btnBoolean(0, 1);
                slideremains = this.items.length - this.data.items;
            }
            else {
                this.btnBoolean(0, 0);
                slideremains = index * this.data.slideItems;
            }
            this.carouselScrollTwo(btns, slideremains, this.data.speed);
        }
    };
    /* set the style of the carousel based the inputs data */
    NgxCarouselComponent.prototype.carouselSize = function () {
        this.data.classText = this.generateID();
        var dism = '';
        var styleid = '.' + this.data.classText + ' > .ngxcarousel > .ngxcarousel-inner > .ngxcarousel-items >';
        if (this.userData.custom === 'banner') {
            this.renderer.setElementClass(this.carousel, 'banner', true);
        }
        // if (this.userData.animation && this.userData.animation.animateStyles) {
        //   dism += `${styleid} .customAnimation {${this.userData.animation
        //     .animateStyles.style}} ${styleid} .item {transition: .3s ease all}`;
        // }
        if (this.userData.animation === 'lazy') {
            dism += styleid + " .item {transition: transform .6s ease;}";
        }
        var itemStyle = '';
        if (this.data.type === 'responsive') {
            var itemWidth_xs = this.userData.type === 'mobile'
                ? styleid + " .item {width: " + 95 / this.userData.grid.xs + "%}"
                : styleid + " .item {width: " + 100 / this.userData.grid.xs + "%}";
            var itemWidth_sm = styleid + ' .item {width: ' + 100 / this.userData.grid.sm + '%}';
            var itemWidth_md = styleid + ' .item {width: ' + 100 / this.userData.grid.md + '%}';
            var itemWidth_lg = styleid + ' .item {width: ' + 100 / this.userData.grid.lg + '%}';
            itemStyle = "@media (max-width:767px){" + itemWidth_xs + "}\n                    @media (min-width:768px){" + itemWidth_sm + "}\n                    @media (min-width:992px){" + itemWidth_md + "}\n                    @media (min-width:1200px){" + itemWidth_lg + "}";
        }
        else {
            itemStyle = styleid + " .item {width: " + this.userData.grid.all + "px}";
        }
        this.renderer.setElementClass(this.carousel, this.data.classText, true);
        var styleItem = this.renderer.createElement(this.carousel, 'style');
        this.renderer.createText(styleItem, dism + " " + itemStyle);
    };
    /* logic to scroll the carousel step 1 */
    NgxCarouselComponent.prototype.carouselScrollOne = function (Btn) {
        var itemSpeed = this.data.speed;
        var translateXval, currentSlide = 0;
        var touchMove = Math.ceil(this.data.dexVal / this.data.itemWidth);
        this.setStyle(this.carouselInner, 'transform', '');
        if (this.pointIndex === 1) {
            return;
        }
        else if (Btn === 0 &&
            ((!this.data.loop && !this.data.isFirst) || this.data.loop)) {
            var slide = this.data.slideItems * this.pointIndex;
            var currentSlideD = this.data.currentSlide - this.data.slideItems;
            var MoveSlide = currentSlideD + this.data.slideItems;
            this.btnBoolean(0, 1);
            if (this.data.currentSlide === 0) {
                currentSlide = this.items.length - this.data.items;
                itemSpeed = 400;
                this.btnBoolean(0, 1);
            }
            else if (this.data.slideItems >= MoveSlide) {
                currentSlide = translateXval = 0;
                this.btnBoolean(1, 0);
            }
            else {
                this.btnBoolean(0, 0);
                if (touchMove > this.data.slideItems) {
                    currentSlide = this.data.currentSlide - touchMove;
                    itemSpeed = 200;
                }
                else {
                    currentSlide = this.data.currentSlide - this.data.slideItems;
                }
            }
            this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
        }
        else if (Btn === 1 && ((!this.data.loop && !this.data.isLast) || this.data.loop)) {
            if (this.items.length <=
                this.data.currentSlide + this.data.items + this.data.slideItems &&
                !this.data.isLast) {
                currentSlide = this.items.length - this.data.items;
                this.btnBoolean(0, 1);
            }
            else if (this.data.isLast) {
                currentSlide = translateXval = 0;
                itemSpeed = 400;
                this.btnBoolean(1, 0);
            }
            else {
                this.btnBoolean(0, 0);
                if (touchMove > this.data.slideItems) {
                    currentSlide =
                        this.data.currentSlide +
                            this.data.slideItems +
                            (touchMove - this.data.slideItems);
                    itemSpeed = 200;
                }
                else {
                    currentSlide = this.data.currentSlide + this.data.slideItems;
                }
            }
            this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
        }
        // cubic-bezier(0.15, 1.04, 0.54, 1.13)
    };
    /* logic to scroll the carousel step 2 */
    NgxCarouselComponent.prototype.carouselScrollTwo = function (Btn, currentSlide, itemSpeed) {
        this.data.visibleItems.start = currentSlide;
        this.data.visibleItems.end = currentSlide + this.data.items - 1;
        // tslint:disable-next-line:no-unused-expression
        this.userData.animation &&
            this.carouselAnimator(Btn, currentSlide + 1, currentSlide + this.data.items, itemSpeed, Math.abs(this.data.currentSlide - currentSlide));
        if (this.data.dexVal !== 0) {
            // const first = .5;
            // const second = .50;
            // tslint:disable-next-line:max-line-length
            // this.setStyle(this.carouselInner, 'transition', `transform ${itemSpeed}ms ${this.userData.easing}`);
            // } else {
            var val = Math.abs(this.data.touch.velocity);
            // const first = .7 / val < .5 ? .7 / val : .5;
            // const second = (2.9 * val / 10 < 1.3) ? (2.9 * val) / 10 : 1.3;
            var somt = Math.floor(this.data.dexVal /
                val /
                this.data.dexVal *
                (this.data.deviceWidth - this.data.dexVal));
            somt = somt > itemSpeed ? itemSpeed : somt;
            itemSpeed = somt < 200 ? 200 : somt;
            // tslint:disable-next-line:max-line-length
            // this.setStyle(this.carouselInner, 'transition', `transform ${itemSpeed}ms ${this.userData.easing}`);
            // this.carouselInner.style.transition = `transform ${itemSpeed}ms cubic-bezier(0.15, 1.04, 0.54, 1.13) `;
            this.data.dexVal = 0;
        }
        this.setStyle(this.carouselInner, 'transition', "transform " + itemSpeed + "ms " + this.data.easing);
        this.data.itemLength = this.items.length;
        this.transformStyle(currentSlide);
        this.data.currentSlide = currentSlide;
        this.onMove.emit(this.data);
        this.carouselPointActiver();
        this.carouselLoadTrigger();
        this.buttonControl();
    };
    /* boolean function for making isFirst and isLast */
    NgxCarouselComponent.prototype.btnBoolean = function (first, last) {
        this.data.isFirst = first ? true : false;
        this.data.isLast = last ? true : false;
    };
    /* set the transform style to scroll the carousel  */
    NgxCarouselComponent.prototype.transformStyle = function (slide) {
        var slideCss = '';
        if (this.data.type === 'responsive') {
            this.data.transform.xs = 100 / this.userData.grid.xs * slide;
            this.data.transform.sm = 100 / this.userData.grid.sm * slide;
            this.data.transform.md = 100 / this.userData.grid.md * slide;
            this.data.transform.lg = 100 / this.userData.grid.lg * slide;
            slideCss = "@media (max-width: 767px) {\n              ." + this.data
                .classText + " > .ngxcarousel > .ngxcarousel-inner > .ngxcarousel-items { transform: translate3d(-" + this
                .data.transform.xs + "%, 0, 0); } }\n            @media (min-width: 768px) {\n              ." + this.data
                .classText + " > .ngxcarousel > .ngxcarousel-inner > .ngxcarousel-items { transform: translate3d(-" + this
                .data.transform.sm + "%, 0, 0); } }\n            @media (min-width: 992px) {\n              ." + this.data
                .classText + " > .ngxcarousel > .ngxcarousel-inner > .ngxcarousel-items { transform: translate3d(-" + this
                .data.transform.md + "%, 0, 0); } }\n            @media (min-width: 1200px) {\n              ." + this.data
                .classText + " > .ngxcarousel > .ngxcarousel-inner > .ngxcarousel-items { transform: translate3d(-" + this
                .data.transform.lg + "%, 0, 0); } }";
        }
        else {
            this.data.transform.all = this.userData.grid.all * slide;
            slideCss = "." + this.data
                .classText + " > .ngxcarousel > .ngxcarousel-inner > .ngxcarousel-items { transform: translate3d(-" + this.data
                .transform.all + "px, 0, 0);";
        }
        // this.renderer.createText(this.carouselCssNode, slideCss);
        this.carouselCssNode.innerHTML = slideCss;
    };
    /* this will trigger the carousel to load the items */
    NgxCarouselComponent.prototype.carouselLoadTrigger = function () {
        if (typeof this.userData.load === 'number') {
            // tslint:disable-next-line:no-unused-expression
            this.items.length - this.data.load <=
                this.data.currentSlide + this.data.items &&
                this.carouselLoad.emit(this.data.currentSlide);
        }
    };
    /* generate Class for each carousel to set specific style */
    NgxCarouselComponent.prototype.generateID = function () {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return "ngxcarousel" + text;
    };
    /* handle the auto slide */
    NgxCarouselComponent.prototype.carouselInterval = function () {
        var _this = this;
        if (typeof this.userData.interval === 'number' && this.data.loop) {
            this.renderer.listen(this.carouselMain, 'touchstart', function () {
                _this.carouselIntervalEvent(1);
            });
            this.renderer.listen(this.carouselMain, 'touchend', function () {
                _this.carouselIntervalEvent(0);
            });
            this.renderer.listen(this.carouselMain, 'mouseenter', function () {
                _this.carouselIntervalEvent(1);
            });
            this.renderer.listen(this.carouselMain, 'mouseleave', function () {
                _this.carouselIntervalEvent(0);
            });
            this.renderer.listenGlobal('window', 'scroll', function () {
                clearTimeout(_this.onScrolling);
                _this.onScrolling = setTimeout(function () {
                    _this.onWindowScrolling();
                }, 600);
            });
            this.carouselInt = setInterval(function () {
                // tslint:disable-next-line:no-unused-expression
                !_this.pauseCarousel && _this.carouselScrollOne(1);
            }, this.userData.interval);
        }
    };
    /* pause interval for specific time */
    NgxCarouselComponent.prototype.carouselIntervalEvent = function (ev) {
        var _this = this;
        this.evtValue = ev;
        if (this.evtValue === 0) {
            clearTimeout(this.pauseInterval);
            this.pauseInterval = setTimeout(function () {
                // tslint:disable-next-line:no-unused-expression
                _this.evtValue === 0 && (_this.pauseCarousel = false);
            }, this.userData.interval);
        }
        else {
            this.pauseCarousel = true;
        }
    };
    /* animate the carousel items */
    NgxCarouselComponent.prototype.carouselAnimator = function (direction, start, end, speed, length) {
        var _this = this;
        var val = length < 5 ? length : 5;
        val = val === 1 ? 3 : val;
        if (direction === 1) {
            for (var i = start - 1; i < end; i++) {
                val = val * 2;
                // tslint:disable-next-line:no-unused-expression
                this.carouselItems[i] && this.setStyle(this.carouselItems[i], 'transform', "translate3d(" + val + "px, 0, 0)");
            }
        }
        else {
            for (var i = end - 1; i >= start - 1; i--) {
                val = val * 2;
                // tslint:disable-next-line:no-unused-expression
                this.carouselItems[i] && this.setStyle(this.carouselItems[i], 'transform', "translate3d(-" + val + "px, 0, 0)");
            }
        }
        setTimeout(function () {
            for (var i = 0; i < _this.items.length; i++) {
                _this.setStyle(_this.carouselItems[i], 'transform', 'translate3d(0, 0, 0)');
            }
        }, speed * .7);
    };
    /* control button for loop */
    NgxCarouselComponent.prototype.buttonControl = function () {
        if (!this.data.loop || (this.data.isFirst && this.data.isLast)) {
            this.setStyle(this.leftBtn, 'display', this.data.isFirst ? 'none' : 'block');
            this.setStyle(this.rightBtn, 'display', this.data.isLast ? 'none' : 'block');
        }
        else {
            this.setStyle(this.leftBtn, 'display', 'block');
            this.setStyle(this.rightBtn, 'display', 'block');
        }
    };
    NgxCarouselComponent.prototype.setStyle = function (el, prop, val) {
        this.renderer.setElementStyle(el, prop, val);
    };
    return NgxCarouselComponent;
}());
export { NgxCarouselComponent };
NgxCarouselComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'ngx-carousel',
                template: "<div #ngxcarousel class=\"ngxcarousel\"><div #forTouch class=\"ngxcarousel-inner\"><div #ngxitems class=\"ngxcarousel-items\"><ng-content select=\"[NgxCarouselItem]\"></ng-content></div><div style=\"clear: both\"></div></div><ng-content select=\"[NgxCarouselPrev]\"></ng-content><ng-content select=\"[NgxCarouselNext]\"></ng-content></div><div #points *ngIf=\"userData.point.visible\"><ul class=\"ngxcarouselPoint\"><li #pointInner *ngFor=\"let i of pointNumbers; let i=index\" [class.active]=\"i==pointers\" (click)=\"moveTo(i)\"></li></ul></div>",
                styles: [
                    "\n    :host {\n      display: block;\n      position: relative;\n    }\n\n    .ngxcarousel .ngxcarousel-inner {\n      position: relative;\n      overflow: hidden;\n    }\n    .ngxcarousel .ngxcarousel-inner .ngxcarousel-items {\n      white-space: nowrap;\n      position: relative;\n    }\n\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint {\n      position: absolute;\n      width: 100%;\n      bottom: 20px;\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint li {\n      background: rgba(255, 255, 255, 0.55);\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint li.active {\n      background: white;\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint li:hover {\n      cursor: pointer;\n    }\n\n    .ngxcarouselPointDefault .ngxcarouselPoint {\n      list-style-type: none;\n      text-align: center;\n      padding: 12px;\n      margin: 0;\n      white-space: nowrap;\n      overflow: auto;\n      box-sizing: border-box;\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint li {\n      display: inline-block;\n      border-radius: 50%;\n      background: rgba(0, 0, 0, 0.55);\n      padding: 4px;\n      margin: 0 4px;\n      transition-timing-function: cubic-bezier(0.17, 0.67, 0.83, 0.67);\n      transition: 0.4s;\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint li.active {\n      background: #6b6b6b;\n      transform: scale(1.8);\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint li:hover {\n      cursor: pointer;\n    }\n  "
                ]
            },] },
];
/** @nocollapse */
NgxCarouselComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
]; };
NgxCarouselComponent.propDecorators = {
    'userData': [{ type: Input, args: ['inputs',] },],
    'moveToSlide': [{ type: Input, args: ['moveToSlide',] },],
    'carouselLoad': [{ type: Output, args: ['carouselLoad',] },],
    'onMove': [{ type: Output, args: ['onMove',] },],
    'afterCarouselViewed': [{ type: Output, args: ['afterCarouselViewed',] },],
    'items': [{ type: ContentChildren, args: [NgxCarouselItemDirective,] },],
    'points': [{ type: ViewChildren, args: ['pointInner', { read: ElementRef },] },],
    'next': [{ type: ContentChild, args: [NgxCarouselNextDirective, { read: ElementRef },] },],
    'prev': [{ type: ContentChild, args: [NgxCarouselPrevDirective, { read: ElementRef },] },],
    'carouselMain1': [{ type: ViewChild, args: ['ngxcarousel', { read: ElementRef },] },],
    'carouselInner1': [{ type: ViewChild, args: ['ngxitems', { read: ElementRef },] },],
    'carousel1': [{ type: ViewChild, args: ['main', { read: ElementRef },] },],
    'pointMain': [{ type: ViewChild, args: ['points', { read: ElementRef },] },],
    'forTouch': [{ type: ViewChild, args: ['forTouch', { read: ElementRef },] },],
    'onResizing': [{ type: HostListener, args: ['window:resize', ['$event'],] },],
};
//# sourceMappingURL=ngx-carousel.component.js.map