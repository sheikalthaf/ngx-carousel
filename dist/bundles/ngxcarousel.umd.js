(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.ngxcarousel = global.ng.ngxcarousel || {}),global.ng.core,global.ng['platform-browser'],global.ng.common));
}(this, (function (exports,_angular_core,_angular_platformBrowser,_angular_common) { 'use strict';

var NgxCarouselItemDirective = (function () {
    function NgxCarouselItemDirective() {
    }
    return NgxCarouselItemDirective;
}());
NgxCarouselItemDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: '[NgxCarouselItem]'
            },] },
];
/** @nocollapse */
NgxCarouselItemDirective.ctorParameters = function () { return []; };
var NgxCarouselNextDirective = (function () {
    function NgxCarouselNextDirective() {
    }
    return NgxCarouselNextDirective;
}());
NgxCarouselNextDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: '[NgxCarouselNext]'
            },] },
];
/** @nocollapse */
NgxCarouselNextDirective.ctorParameters = function () { return []; };
var NgxCarouselPrevDirective = (function () {
    function NgxCarouselPrevDirective() {
    }
    return NgxCarouselPrevDirective;
}());
NgxCarouselPrevDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: '[NgxCarouselPrev]'
            },] },
];
/** @nocollapse */
NgxCarouselPrevDirective.ctorParameters = function () { return []; };

var NgxCarouselComponent = (function () {
    function NgxCarouselComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.carouselLoad = new _angular_core.EventEmitter();
        this.pauseCarousel = false;
        this.currentSlide = 0;
        this.Arr1 = Array;
        this.pointNumbers = [];
        this.data = {
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
    }
    NgxCarouselComponent.prototype.ngOnInit = function () {
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
    };
    NgxCarouselComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.renderer.listen(this.leftBtn, 'click', function () { return _this.carouselScrollOne(0); });
        this.renderer.listen(this.rightBtn, 'click', function () { return _this.carouselScrollOne(1); });
        // this.userData.point.
        // this.pointMain
        var styleItem = document.createElement('style');
        if (!this.carouselInner.querySelectorAll('style').length) {
            this.carouselInner.appendChild(styleItem);
        }
        this.storeCarouselData();
        this.carouselInterval();
        this.onWindowScrolling();
        this.buttonControl();
        this.touch();
        this.carouselPoint();
        this.items.changes.subscribe(function (val) {
            _this.data.isLast = false;
            _this.carouselPoint();
            _this.buttonControl();
        });
    };
    NgxCarouselComponent.prototype.ngAfterViewInit = function () {
        if (this.userData.point.pointStyles) {
            var datas = this.userData.point.pointStyles.replace(/.ngxcarouselPoint/g, "." + this.data.classText + " .ngxcarouselPoint");
            // console.log(datas);
            var styleItem = document.createElement('style');
            styleItem.innerHTML = datas;
            this.carousel.appendChild(styleItem);
        }
        else {
            this.renderer.setElementClass(this.pointMain.nativeElement, 'ngxcarouselPointDefault', true);
        }
    };
    NgxCarouselComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.carouselInt);
    };
    NgxCarouselComponent.prototype.onResizing = function (event) {
        var _this = this;
        clearTimeout(this.onResize);
        this.onResize = setTimeout(function () {
            // tslint:disable-next-line:no-unused-expression
            _this.data.deviceWidth !== event.target.outerWidth && _this.storeCarouselData();
        }, 500);
    };
    /* Get Touch input */
    NgxCarouselComponent.prototype.touch = function () {
        var _this = this;
        if (this.userData.touch) {
            var hammertime = new Hammer(this.carouselInner);
            hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammertime.on('panstart', function (ev) {
                _this.data.carouselWidth = _this.carouselInner.offsetWidth;
                _this.data.touchTransform =
                    _this.data.deviceType === 'xs' ? _this.data.transform.xs :
                        _this.data.deviceType === 'sm' ? _this.data.transform.sm :
                            _this.data.deviceType === 'md' ? _this.data.transform.md :
                                _this.data.deviceType === 'lg' ? _this.data.transform.lg :
                                    _this.data.transform.all;
                _this.data.dexVal = 0;
                _this.setStyle(_this.carouselInner, 'transition', '');
            });
            hammertime.on('panleft', function (ev) {
                _this.touchHandling('panleft', ev.deltaX);
            });
            hammertime.on('panright', function (ev) {
                _this.touchHandling('panright', ev.deltaX);
            });
            hammertime.on('panend', function (ev) {
                _this.setStyle(_this.carouselInner, 'transform', '');
                _this.data.touch.velocity = ev.velocity;
                _this.data.touch.swipe === 'panright' ? _this.carouselScrollOne(0) : _this.carouselScrollOne(1);
            });
        }
    };
    /* handle touch input */
    NgxCarouselComponent.prototype.touchHandling = function (e, ev) {
        ev = Math.abs(ev);
        var valt = ev - this.data.dexVal;
        valt = this.data.type === 'responsive' ? Math.abs(ev - this.data.dexVal) / this.data.carouselWidth * 100 : valt;
        this.data.dexVal = ev;
        this.data.touch.swipe = e;
        this.data.touchTransform = e === 'panleft' ? valt + this.data.touchTransform : this.data.touchTransform - valt;
        if (this.data.touchTransform > 0) {
            this.setStyle(this.carouselInner, 'transform', this.data.type === 'responsive' ?
                "translate3d(-" + this.data.touchTransform + "%, 0px, 0px)" :
                "translate3d(-" + this.data.touchTransform + "px, 0px, 0px)");
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
        if ((top <= scrollY + heightt - carouselHeight / 4) && (top + carouselHeight / 2 >= scrollY)) {
            this.carouselIntervalEvent(0);
        }
        else {
            this.carouselIntervalEvent(1);
        }
    };
    /* store data based on width of the screen for the carousel */
    NgxCarouselComponent.prototype.storeCarouselData = function () {
        // console.log(this.carouselMain1);
        this.data.deviceWidth = window.innerWidth;
        this.data.carouselWidth = this.carouselMain.offsetWidth;
        if (this.data.type === 'responsive') {
            this.data.deviceType =
                this.data.deviceWidth >= 1200 ? 'lg' :
                    this.data.deviceWidth >= 992 ? 'md' :
                        this.data.deviceWidth >= 768 ? 'sm' : 'xs';
            this.data.items = +(this.data.deviceWidth >= 1200 ? this.userData.grid.lg :
                this.data.deviceWidth >= 992 ? this.userData.grid.md :
                    this.data.deviceWidth >= 768 ? this.userData.grid.sm :
                        this.userData.grid.xs);
            this.data.width = this.data.carouselWidth / this.data.items;
        }
        else {
            this.data.items = Math.trunc(this.data.carouselWidth / this.userData.grid.all);
            this.data.width = this.userData.grid.all;
        }
        this.data.slideItems = +(this.userData.slide < this.data.items ? this.userData.slide : this.data.items);
        this.data.load = this.userData.load >= this.data.slideItems ? this.userData.load : this.data.slideItems;
        this.userData.speed = +(this.userData.speed ? this.userData.speed : 400);
    };
    /* Init carousel point */
    NgxCarouselComponent.prototype.carouselPoint = function () {
        var _this = this;
        if (this.data.slideItems === 0) {
            setTimeout(function () {
                _this.carouselPoint();
            }, 10);
        }
        else if (this.userData.point.visible === true) {
            var Nos = this.items.length - (this.data.items - this.data.slideItems);
            // console.log(this.items.length, this.data.items , this.data.slideItems);
            this.pointIndex = Math.ceil(Nos / this.data.slideItems);
            // console.log(Nos, this.data.slideItems);
            var pointers = [];
            for (var i = 0; i < this.pointIndex; i++) {
                pointers.push(i);
            }
            // let sdf = this.Arr1(points).fill(1);
            this.pointNumbers = pointers;
            setTimeout(function () {
                _this.carouselPointActiver();
            });
        }
    };
    /* change the active point in carousel */
    NgxCarouselComponent.prototype.carouselPointActiver = function () {
        // const parent = this.carousel.querySelectorAll('.ngxcarouselPointInner div');
        // const parent = this.points;
        // console.log(this.points);
        if (this.points.length !== 0) {
            var i = Math.ceil(this.currentSlide / this.data.slideItems);
            // for (let j = 0; j < parent.length; j++) {
            //   this.renderer.setElementClass(parent[j], 'active', false);
            // }
            // this.points.forEach(div => {
            //   this.renderer.setElementClass(div.nativeElement, 'active', false);
            // });
            this.pointers = i;
            // this.renderer.setElementClass(this.points._results[i].nativeElement, 'active', true);
        }
    };
    /* this function is used to scoll the carousel when point is clicked */
    NgxCarouselComponent.prototype.moveTo = function (index) {
        if (this.currentSlide !== index) {
            var slideremains = 0;
            var btns = this.currentSlide < index ? 1 : 0;
            if (index === 0) {
                this.data.isFirst = true;
                this.data.isLast = false;
                slideremains = index * this.data.slideItems;
            }
            else if (index === this.pointIndex - 1) {
                this.data.isFirst = false;
                this.data.isLast = true;
                slideremains = this.items.length - this.data.items;
            }
            else {
                this.data.isFirst = false;
                this.data.isLast = false;
                slideremains = index * this.data.slideItems;
            }
            this.carouselScrollTwo(btns, slideremains, this.userData.speed);
        }
    };
    /* set the style of the carousel based the inputs data */
    NgxCarouselComponent.prototype.carouselSize = function () {
        this.data.classText = this.generateID();
        var dism = '';
        var styleid = '.' + this.data.classText;
        // const btnCss = `position: absolute;margin: auto;top: 0;bottom: 0;width: 50px;height: 50px;
        //                 box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;`;
        // dism += `${styleid} .leftRs {${btnCss}left: 0;} ${styleid} .rightRs {${btnCss}right: 0;}`;
        if (this.userData.custom === 'banner') {
            this.renderer.setElementClass(this.carousel, 'banner', true);
        }
        if (this.userData.animation === 'lazy') {
            dism += styleid + " .item {transition: transform .6s ease;}";
        }
        var itemStyle = '';
        if (this.data.type === 'responsive') {
            var itemWidth_xs = this.userData.type === 'mobile' ?
                styleid + " .item {width: " + 95 / this.userData.grid.xs + "%}" :
                styleid + " .item {width: " + 100 / this.userData.grid.xs + "%}";
            var itemWidth_sm = styleid + ' .item {width: ' + 100 / this.userData.grid.sm + '%}';
            var itemWidth_md = styleid + ' .item {width: ' + 100 / this.userData.grid.md + '%}';
            var itemWidth_lg = styleid + ' .item {width: ' + 100 / this.userData.grid.lg + '%}';
            itemStyle = "@media (max-width:767px){" + itemWidth_xs + "}\n                    @media (min-width:768px){" + itemWidth_sm + "}\n                    @media (min-width:992px){" + itemWidth_md + "}\n                    @media (min-width:1200px){" + itemWidth_lg + "}";
        }
        else {
            itemStyle = styleid + " .item {width: " + this.userData.grid.all + "px}";
        }
        this.renderer.setElementClass(this.carousel, this.data.classText, true);
        var styleItem = document.createElement('style');
        styleItem.innerHTML = dism + " " + itemStyle;
        this.carousel.appendChild(styleItem);
    };
    /* logic to scroll the carousel step 1 */
    NgxCarouselComponent.prototype.carouselScrollOne = function (Btn) {
        // console.log(this.data.loop, this.data.isFirst, this.data.isLast);
        var itemSpeed = this.userData.speed;
        var translateXval, currentSlide = 0;
        var touchMove = Math.ceil(this.data.dexVal / this.data.width);
        this.setStyle(this.carouselInner, 'transform', '');
        if (Btn === 0) {
            // if ((this.data.loop && !this.data.isFirst) || !this.data.loop) {
            if ((!this.data.loop && !this.data.isFirst) || this.data.loop) {
                var slide = this.data.slideItems * this.pointIndex;
                var currentSlideD = this.currentSlide - this.data.slideItems;
                var MoveSlide = currentSlideD + this.data.slideItems;
                // this.data.isEnd = false;
                this.data.isFirst = false;
                if (this.currentSlide === 0) {
                    // if (this.data.loop) { return false; }
                    currentSlide = this.items.length - this.data.items;
                    itemSpeed = 400;
                    // this.data.isEnd = true;
                    this.data.isFirst = false;
                    this.data.isLast = true;
                }
                else if (this.data.slideItems >= MoveSlide) {
                    currentSlide = translateXval = 0;
                    this.data.isFirst = true;
                    // this.data.isLast = false;
                }
                else {
                    this.data.isLast = false;
                    if (touchMove > this.data.slideItems) {
                        currentSlide = this.currentSlide - touchMove;
                        itemSpeed = 200;
                    }
                    else {
                        currentSlide = this.currentSlide - this.data.slideItems;
                    }
                }
                this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
            }
        }
        else {
            if ((!this.data.loop && !this.data.isLast) || this.data.loop) {
                if ((this.items.length <= (this.currentSlide + this.data.items + this.data.slideItems)) && !this.data.isLast) {
                    currentSlide = this.items.length - this.data.items;
                    // this.data.isEnd = true;
                    this.data.isLast = true;
                }
                else if (this.data.isLast) {
                    // if (this.data.loop) { return false; }
                    currentSlide = translateXval = 0;
                    itemSpeed = 400;
                    // this.data.isEnd = false;
                    this.data.isLast = false;
                    this.data.isFirst = true;
                }
                else {
                    // this.data.isEnd = false;
                    this.data.isLast = false;
                    this.data.isFirst = false;
                    if (touchMove > this.data.slideItems) {
                        currentSlide = this.currentSlide + this.data.slideItems + (touchMove - this.data.slideItems);
                        itemSpeed = 200;
                    }
                    else {
                        currentSlide = this.currentSlide + this.data.slideItems;
                    }
                }
                this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
            }
        }
        // console.log(this.data.isFirst, this.data.isLast);
        // console.log(this.data.loop, this.data.isFirst, this.data.isLast);
        // cubic-bezier(0.15, 1.04, 0.54, 1.13)
    };
    /* logic to scroll the carousel step 2 */
    NgxCarouselComponent.prototype.carouselScrollTwo = function (Btn, currentSlide, itemSpeed) {
        // console.log(this.currentSlide, currentSlide);
        // tslint:disable-next-line:no-unused-expression
        this.userData.animation === 'lazy' &&
            this.carouselAnimator(Btn, currentSlide + 1, currentSlide + this.data.items, itemSpeed, Math.abs(this.currentSlide - currentSlide));
        if (this.data.dexVal === 0) {
            var first = .5;
            var second = .50;
            // tslint:disable-next-line:max-line-length
            this.setStyle(this.carouselInner, 'transition', "transform " + itemSpeed + "ms " + this.userData.easing);
        }
        else {
            var val = Math.abs(this.data.touch.velocity);
            var first = .7 / val < .5 ? .7 / val : .5;
            var second = (2.9 * val / 10 < 1.3) ? (2.9 * val) / 10 : 1.3;
            var somt = Math.floor((this.data.dexVal / val) / this.data.dexVal * (this.data.deviceWidth - this.data.dexVal));
            somt = somt > itemSpeed ? itemSpeed : somt;
            itemSpeed = somt < 200 ? 200 : somt;
            // tslint:disable-next-line:max-line-length
            this.setStyle(this.carouselInner, 'transition', "transform " + itemSpeed + "ms " + this.userData.easing);
            // this.carouselInner.style.transition = `transform ${itemSpeed}ms cubic-bezier(0.15, 1.04, 0.54, 1.13) `;
            this.data.dexVal = 0;
        }
        this.transformStyle(currentSlide);
        this.currentSlide = currentSlide;
        this.carouselPointActiver();
        this.carouselLoadTrigger();
        this.buttonControl();
    };
    /* set the transform style to scroll the carousel  */
    NgxCarouselComponent.prototype.transformStyle = function (slide) {
        var slideCss = '';
        if (this.data.type === 'responsive') {
            this.data.transform.xs = 100 / this.userData.grid.xs * slide;
            this.data.transform.sm = 100 / this.userData.grid.sm * slide;
            this.data.transform.md = 100 / this.userData.grid.md * slide;
            this.data.transform.lg = 100 / this.userData.grid.lg * slide;
            slideCss = "@media (max-width: 767px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.xs + "%, 0, 0); } }\n            @media (min-width: 768px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.sm + "%, 0, 0); } }\n            @media (min-width: 992px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.md + "%, 0, 0); } }\n            @media (min-width: 1200px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.lg + "%, 0, 0); } }";
        }
        else {
            this.data.transform.all = this.userData.grid.all * slide;
            slideCss = "." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.all + "px, 0, 0);";
        }
        this.carouselInner.querySelectorAll('style')[0].innerHTML = slideCss;
    };
    /* this will trigger the carousel to load the items */
    NgxCarouselComponent.prototype.carouselLoadTrigger = function () {
        if (typeof this.userData.load === 'number') {
            // tslint:disable-next-line:no-unused-expression
            (this.items.length - this.data.load) <= (this.currentSlide + this.data.items) &&
                this.carouselLoad.emit(this.currentSlide);
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
    };
    NgxCarouselComponent.prototype.setStyle = function (el, prop, val) {
        this.renderer.setElementStyle(el, prop, val);
    };
    return NgxCarouselComponent;
}());
NgxCarouselComponent.decorators = [
    { type: _angular_core.Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'ngx-carousel',
                template: "<div #main class=\"som\"><div #ngxcarousel class=\"ngxcarousel\"><div class=\"ngxcarousel-inner\"><div #ngxitems class=\"ngxcarousel-items\"><ng-content select=\"[NgxCarouselItem]\"></ng-content></div><div style=\"clear: both\"></div></div><ng-content select=\"[NgxCarouselPrev]\"></ng-content><ng-content select=\"[NgxCarouselNext]\"></ng-content></div><div #points *ngIf=\"userData.point.visible\"><ul class=\"ngxcarouselPoint\"><li #pointInner *ngFor=\"let i of pointNumbers; let i=index\" [class.active]=\"i==pointers\" (click)=\"moveTo(i)\"></li></ul></div></div>",
                styles: ["\n    .som {\n      width: 100%;\n      position: relative;\n    }\n    .som .ngxcarousel {\n      width: 100%;\n      position: relative;\n    }\n    .som .ngxcarousel .ngxcarousel-inner {\n      position: relative;\n      overflow: hidden;\n    }\n    .som .ngxcarousel .ngxcarousel-inner .ngxcarousel-items {\n      white-space: nowrap;\n      position: relative;\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint {\n      position: absolute;\n      width: 100%;\n      bottom: 20px;\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint li {\n      background: rgba(255, 255, 255, 0.55);\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint li.active {\n      background: white;\n    }\n    .banner .ngxcarouselPointDefault .ngxcarouselPoint li:hover {\n      cursor: pointer;\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint {\n      list-style-type: none;\n      text-align: center;\n      padding: 12px;\n      margin: 0;\n      white-space: nowrap;\n      overflow: auto;\n      box-sizing: border-box;\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint li {\n      display: inline-block;\n      border-radius: 50%;\n      background: rgba(0, 0, 0, 0.55);\n      padding: 4px;\n      margin: 0 4px;\n      transition-timing-function: cubic-bezier(0.17, 0.67, 0.83, 0.67);\n      transition: .4s;\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint li.active {\n      background: #6b6b6b;\n      transform: scale(1.8);\n    }\n    .ngxcarouselPointDefault .ngxcarouselPoint li:hover {\n      cursor: pointer;\n    }\n  "]
            },] },
];
/** @nocollapse */
NgxCarouselComponent.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer, },
]; };
NgxCarouselComponent.propDecorators = {
    'userData': [{ type: _angular_core.Input, args: ['inputs',] },],
    'carouselLoad': [{ type: _angular_core.Output, args: ['carouselLoad',] },],
    'items': [{ type: _angular_core.ContentChildren, args: [NgxCarouselItemDirective,] },],
    'points': [{ type: _angular_core.ViewChildren, args: ['pointInner', { read: _angular_core.ElementRef },] },],
    'next': [{ type: _angular_core.ContentChild, args: [NgxCarouselNextDirective, { read: _angular_core.ElementRef },] },],
    'prev': [{ type: _angular_core.ContentChild, args: [NgxCarouselPrevDirective, { read: _angular_core.ElementRef },] },],
    'carouselMain1': [{ type: _angular_core.ViewChild, args: ['ngxcarousel', { read: _angular_core.ElementRef },] },],
    'carouselInner1': [{ type: _angular_core.ViewChild, args: ['ngxitems', { read: _angular_core.ElementRef },] },],
    'carousel1': [{ type: _angular_core.ViewChild, args: ['main', { read: _angular_core.ElementRef },] },],
    'pointMain': [{ type: _angular_core.ViewChild, args: ['points', { read: _angular_core.ElementRef },] },],
    'onResizing': [{ type: _angular_core.HostListener, args: ['window:resize', ['$event'],] },],
};

var NgxItemComponent = (function () {
    function NgxItemComponent() {
    }
    NgxItemComponent.prototype.ngOnInit = function () {
    };
    return NgxItemComponent;
}());
NgxItemComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngx-item',
                template: "<div class=\"item\"><ng-content></ng-content></div>",
                styles: ["\n    .item {\n        display: inline-block;\n        white-space: initial;\n    }\n  "]
            },] },
];
/** @nocollapse */
NgxItemComponent.ctorParameters = function () { return []; };

var NgxTileComponent = (function () {
    function NgxTileComponent() {
    }
    NgxTileComponent.prototype.ngOnInit = function () {
    };
    return NgxTileComponent;
}());
NgxTileComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngx-tile',
                template: "<div class=\"item\"><div class=\"tile\"><ng-content></ng-content></div></div>",
                styles: ["\n    .item {\n        display: inline-block;\n        white-space: initial;\n        padding: 10px;\n    }\n\n    .tile {\n        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    }\n\n    * {\n        box-sizing: border-box;\n    }\n  "]
            },] },
];
/** @nocollapse */
NgxTileComponent.ctorParameters = function () { return []; };

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyHammerConfig = (function (_super) {
    __extends(MyHammerConfig, _super);
    function MyHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            'swipe': { velocity: 0.4, threshold: 20 },
            'pan': { velocity: 0.4, threshold: 20 }
        };
        return _this;
    }
    return MyHammerConfig;
}(_angular_platformBrowser.HammerGestureConfig));
var NgxCarouselModule = (function () {
    function NgxCarouselModule() {
    }
    return NgxCarouselModule;
}());
NgxCarouselModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule],
                exports: [
                    NgxCarouselComponent,
                    NgxItemComponent,
                    NgxTileComponent,
                    NgxCarouselItemDirective,
                    NgxCarouselNextDirective,
                    NgxCarouselPrevDirective
                ],
                declarations: [
                    NgxCarouselComponent,
                    NgxItemComponent,
                    NgxTileComponent,
                    NgxCarouselItemDirective,
                    NgxCarouselNextDirective,
                    NgxCarouselPrevDirective
                ],
                providers: [
                    { provide: _angular_platformBrowser.HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
                ],
            },] },
];
/** @nocollapse */
NgxCarouselModule.ctorParameters = function () { return []; };

var NgxCarousel = (function () {
    function NgxCarousel() {
    }
    return NgxCarousel;
}());

exports.NgxCarouselModule = NgxCarouselModule;
exports.NgxCarousel = NgxCarousel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
