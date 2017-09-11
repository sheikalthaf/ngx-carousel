(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.carousel = global.ng.carousel || {}),global.ng.core,global._angular_common));
}(this, (function (exports,_angular_core,_angular_common) { 'use strict';

var CarouselComponent = (function () {
    function CarouselComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.carouselLoad = new _angular_core.EventEmitter();
        this.Arr = Array;
        this.currentSlide = 0;
        this.data = {
            type: 'fixed',
            classText: '',
            items: 0,
            load: 0,
            deviceWidth: 0,
            carouselWidth: 0,
            width: 0,
            pointNumbers: 0,
            visibleItems: 0,
            slideItems: 0,
            itemWidthPer: 0,
            transform: { xs: 0, sm: 0, md: 0, lg: 0, all: 0 },
            loop: false,
            dexVal: 0,
            touchTransform: 0,
            touch: { active: false, swipe: '', velocity: 0 },
            isEnd: false
        };
        // renderer.setStyle(el.nativeElement, 'background', 'grey');
    }
    CarouselComponent.prototype.ngOnInit = function () {
        var _this = this;
        // const t0 = performance.now();
        this.carousel = this.el.nativeElement.getElementsByClassName('som')[0];
        this.carouselMain = this.carousel.getElementsByClassName('ngxcarousel')[0];
        // this.carouselDiv = this.carousel.getElementsByClassName('ngxcarousel-inner')[0];
        this.carouselInner = this.carousel.getElementsByClassName('ngxcarousel-items')[0];
        this.carouselItems = this.carouselInner.getElementsByClassName('item');
        this.data.type = this.inputs.grid.all !== 0 ? 'fixed' : 'responsive';
        // this.storeResData();
        this.carouselSize();
        if (this.inputs.type === 'mobile') {
            this.renderer.listen(this.carouselInner, 'onscroll', function () {
                _this.scrollStart();
            });
        }
        this.carouselInterval();
        this.onWindowScrolling();
        // const t1 = performance.now();
        // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    };
    CarouselComponent.prototype.ngOnChanges = function (changes) {
        if (changes.inputsLength) {
            this.data.isEnd = false;
            this.carouselPoint();
            // console.log(changes);
        }
    };
    CarouselComponent.prototype.ngAfterViewInit = function () {
        var styleItem = document.createElement('style');
        this.carouselInner.appendChild(styleItem);
        // this.renderer.appendChild(this.carouselInner, styleItem);
        this.carouselPoint();
        this.touch();
        this.storeResData();
    };
    CarouselComponent.prototype.onResizing = function (event) {
        var _this = this;
        clearTimeout(this.onResize);
        this.onResize = setTimeout(function () {
            // tslint:disable-next-line:no-unused-expression
            _this.data.deviceWidth !== event.target.outerWidth && _this.storeResData();
        }, 500);
    };
    CarouselComponent.prototype.ontouching = function (event) {
        var element = event.target || event.srcElement;
        var btn = element.classList;
        // tslint:disable-next-line:no-unused-expression
        btn.contains('rightRs') ? this.carouselScroll(1) : btn.contains('leftRs') && this.carouselScroll(0);
    };
    CarouselComponent.prototype.touch = function () {
        var _this = this;
        if (this.inputs.touch) {
            var hammertime = new Hammer(this.carouselInner);
            hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammertime.on('panstart', function (ev) {
                _this.data.carouselWidth = _this.carouselInner.offsetWidth;
                // tslint:disable-next-line:max-line-length
                _this.data.touchTransform = _this.data.deviceType === 'xs' ? _this.data.transform.xs : _this.data.deviceType === 'sm' ? _this.data.transform.sm : _this.data.deviceType === 'md' ? _this.data.transform.md : _this.data.deviceType === 'lg' ? _this.data.transform.lg : _this.data.transform.all;
                _this.data.dexVal = 0;
                _this.renderer.setElementStyle(_this.carouselInner, 'transition', '');
            });
            hammertime.on('panleft', function (ev) {
                _this.touchGues('panleft', ev.deltaX);
            });
            hammertime.on('panright', function (ev) {
                _this.touchGues('panright', ev.deltaX);
            });
            hammertime.on('panend', function (ev) {
                // console.log(ev.velocity);
                _this.renderer.setElementStyle(_this.carouselInner, 'transform', '');
                _this.data.touch.velocity = ev.velocity;
                _this.data.touch.swipe === 'panright' ? _this.carouselScroll(0) : _this.carouselScroll(1);
            });
        }
    };
    CarouselComponent.prototype.touchGues = function (e, ev) {
        var valt = Math.abs(ev) - this.data.dexVal;
        valt = this.data.type === 'responsive' ? Math.abs(Math.abs(ev) - this.data.dexVal) / this.data.carouselWidth * 100 : valt;
        this.data.dexVal = Math.abs(ev);
        this.data.touch.swipe = e;
        this.data.touchTransform = e === 'panleft' ? valt + this.data.touchTransform : this.data.touchTransform - valt;
        if (this.data.touchTransform > 0) {
            // tslint:disable-next-line:max-line-length
            this.renderer.setElementStyle(this.carouselInner, 'transform', this.data.type === 'responsive' ? "translate3d(-" + this.data.touchTransform + "%, 0px, 0px)" : "translate3d(-" + this.data.touchTransform + "px, 0px, 0px)");
        }
        else {
            this.data.touchTransform = 0;
        }
    };
    CarouselComponent.prototype.onWindowScrolling = function () {
        var top = this.carousel.offsetTop;
        var scrollY = window.scrollY;
        var heightt = window.innerHeight;
        var carouselHeight = this.carousel.offsetHeight;
        // console.log(top + ',' + scrollY + ',' + heightt + ',' + carouselHeight);
        // console.log(top <= scrollY + heightt - carouselHeight / 4);
        // console.log(top + carouselHeight / 2 >= scrollY);
        if ((top <= scrollY + heightt - carouselHeight / 4) && (top + carouselHeight / 2 >= scrollY)) {
            // console.log('true');
            this.renderer.setElementClass(this.el.nativeElement, 'ngxcarouselScrolled', false);
            // this.renderer.removeClass(this.el.nativeElement, 'ngxcarouselScrolled');
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, 'ngxcarouselScrolled', true);
            // this.renderer.addClass(this.el.nativeElement, 'ngxcarouselScrolled');
        }
    };
    CarouselComponent.prototype.scrollStart = function () {
        var _this = this;
        clearTimeout(this.itemPosition);
        this.itemPosition = setTimeout(function () {
            _this.currentSlide = Math.round(_this.carouselInner.scrollLeft / _this.data.width);
            _this.carouselLoad1();
            _this.carouselPointActive();
        }, 200);
    };
    CarouselComponent.prototype.storeResData = function () {
        // console.log('ads');
        this.data.deviceWidth = window.innerWidth;
        this.data.carouselWidth = this.carouselMain.offsetWidth;
        if (this.data.type === 'responsive') {
            // tslint:disable-next-line:max-line-length
            this.data.deviceType = this.data.deviceWidth >= 1200 ? 'lg' : this.data.deviceWidth >= 992 ? 'md' : this.data.deviceWidth >= 768 ? 'sm' : 'xs';
            this.data.items = +(this.data.deviceWidth >= 1200 ? this.inputs.grid.lg : this.data.deviceWidth >= 992 ? this.inputs.grid.md : this.data.deviceWidth >= 768 ? this.inputs.grid.sm : this.inputs.grid.xs);
            this.data.width = this.data.carouselWidth / this.data.items;
            // console.log(this.data.width / this.data.carouselWidth * 100);
        }
        else {
            // this.inputs.items = + this.inputs.items;
            this.data.items = Math.floor(this.data.deviceWidth / this.inputs.grid.all);
            this.data.width = this.inputs.grid.all;
            // console.log(this.data.width / this.data.carouselWidth * 100);
        }
        // this.data.itemWidthPer =  { 'xs': + this.data.width / this.data.carouselWidth * 100};
        // this.carouselInner.style.transform = 'translate3d(-' + this.currentSlide * this.data.width + 'px, 0px, 0px)';
        this.data.slideItems = +(this.inputs.slide < this.data.items ? this.inputs.slide : this.data.items);
        this.data.load = this.inputs.load >= this.data.slideItems ? this.inputs.load : this.data.slideItems;
        this.inputs.speed = +(this.inputs.speed ? this.inputs.speed : 400);
        if (this.inputs.type === 'mobile') {
            if (this.data.deviceWidth <= 767) {
                // this.renderer.addClass(this.carousel, 'ngxcarouselMobiled');
                this.renderer.setElementClass(this.carousel, 'ngxcarouselMobiled', true);
                this.renderer.setElementStyle(this.carouselInner, 'transform', 'translate3d(0px, 0px, 0px)');
                this.carouselInner.scrollLeft = +this.currentSlide * this.data.width;
            }
            else {
                this.renderer.setElementClass(this.carousel, 'ngxcarouselMobiled', false);
                // this.renderer.removeClass(this.carousel, 'ngxcarouselMobiled');
            }
        }
    };
    CarouselComponent.prototype.carouselPoint = function () {
        var _this = this;
        if (this.data.slideItems === 0) {
            setTimeout(function () {
                _this.carouselPoint();
            }, 10);
        }
        else if (this.inputs.point === true) {
            // tslint:disable-next-line:max-line-length
            var Nos = this.inputs.dynamicLength === true ? this.inputsLength : this.carouselItems.length - (this.data.items - this.data.slideItems);
            this.data.pointNumbers = Math.ceil(Nos / this.data.slideItems);
            this.carouselPointActive();
        }
    };
    CarouselComponent.prototype.carouselPointActive = function () {
        var parent = this.carousel.querySelectorAll('.ngxcarouselPoint li');
        if (parent.length !== 0) {
            var i = Math.ceil(this.currentSlide / this.data.slideItems);
            // console.log(parent);
            // parent.forEach((element: any) => {
            for (var j = 0; j < parent.length; j++) {
                this.renderer.setElementClass(parent[j], 'active', false);
            }
            // this.renderer.removeClass(element, 'active');
            // });
            this.renderer.setElementClass(parent[i], 'active', true);
            // this.renderer.addClass(parent[i], 'active');
        }
    };
    CarouselComponent.prototype.carouselSize = function () {
        // const t0 = performance.now();
        this.data.classText = 'ResSlid' + this.makeid();
        var dism = '';
        var mobileScroll = '';
        var styleid = '.' + this.data.classText;
        // tslint:disable-next-line:max-line-length
        dism += styleid + " .ngxcarousel-items .item {display: inline-block;white-space: initial;vertical-align: top;} .leftRs {position: absolute;margin: auto;top: 0;bottom: 0;left: 0;width: 50px;height: 50px;box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;}.rightRs {position: absolute; margin: auto; top: 0; right: 0; bottom: 0; width: 50px;height: 50px; box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);border-radius: 999px;}";
        if (this.inputs.custom === 'banner') {
            this.renderer.setElementClass(this.carousel, 'banner', true);
            // this.renderer.addClass(this.carousel, 'banner');
        }
        if (this.inputs.custom === 'tile') {
            dism += "." + this.data.classText + " .tile {box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);margin: 5px;}";
        }
        if (this.inputs.animation === 'lazy') {
            dism += "." + this.data.classText + " .item {transition: transform .6s ease;}";
        }
        if (this.inputs.type === 'mobile') {
            mobileScroll = styleid + " .ngxcarousel-items {overflow-x: auto !important;}\n                        " + styleid + " .leftRs, " + styleid + " .rightRs { display: none }";
        }
        var itemwid = '';
        if (this.data.type === 'responsive') {
            // tslint:disable-next-line:max-line-length
            var styleCollector0 = this.inputs.type === 'mobile' ? styleid + " .item {width: " + 95 / this.inputs.grid.xs + "%}" : styleid + " .item {width: " + 100 / this.inputs.grid.xs + "%}";
            var styleCollector1 = styleid + ' .item {width: ' + 100 / this.inputs.grid.sm + '%}';
            var styleCollector2 = styleid + ' .item {width: ' + 100 / this.inputs.grid.md + '%}';
            var styleCollector3 = styleid + ' .item {width: ' + 100 / this.inputs.grid.lg + '%}';
            // itemwid = `@media (max-width:767px){${mobileScroll}${styleCollector0} ${styleid} .leftRs, ${styleid} .rightRs { display: none }}
            itemwid = "@media (max-width:767px){" + mobileScroll + styleCollector0 + "}\n                    @media (min-width:768px){" + styleCollector1 + "}\n                    @media (min-width:992px){" + styleCollector2 + "}\n                    @media (min-width:1200px){" + styleCollector3 + "}";
        }
        else {
            itemwid = styleid + " .item {width: " + this.inputs.grid.all + "px}\n                  @media (max-width:767px){" + mobileScroll + "}";
        }
        this.renderer.setElementClass(this.carousel, this.data.classText, true);
        // this.renderer.addClass(this.carousel, this.data.classText);
        var styleItem = document.createElement('style');
        styleItem.innerHTML = dism + " " + itemwid;
        this.carousel.appendChild(styleItem);
        // this.renderer.appendChild(this.carousel, styleItem);
        // const t1 = performance.now();
        // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    };
    CarouselComponent.prototype.carouselScroll = function (Btn) {
        // const t0 = performance.now();
        var itemSpeed = this.inputs.speed;
        var translateXval, currentSlide = 0;
        var itemLenght = this.inputs.dynamicLength === true ? this.inputsLength : this.carouselItems.length;
        var touchMove = Math.ceil(this.data.dexVal / this.data.width);
        this.renderer.setElementStyle(this.carouselInner, 'transform', '');
        if (Btn === 0) {
            var currentSlideD = this.currentSlide - this.data.slideItems;
            var MoveSlide = currentSlideD + this.data.slideItems;
            this.data.isEnd = false;
            if (this.currentSlide === 0) {
                if (this.data.loop) {
                    return false;
                }
                currentSlide = itemLenght - this.data.items;
                itemSpeed = 400;
                this.data.isEnd = true;
            }
            else if (this.data.slideItems >= MoveSlide) {
                currentSlide = translateXval = 0;
            }
            else {
                if (touchMove > this.data.slideItems) {
                    currentSlide = this.currentSlide - touchMove;
                    itemSpeed = 200;
                }
                else {
                    currentSlide = this.currentSlide - this.data.slideItems;
                }
            }
        }
        else {
            if ((itemLenght <= (this.currentSlide + this.data.items + this.data.slideItems)) && !this.data.isEnd) {
                currentSlide = itemLenght - this.data.items;
                this.data.isEnd = true;
            }
            else if (this.data.isEnd) {
                if (this.data.loop) {
                    return false;
                }
                currentSlide = translateXval = 0;
                itemSpeed = 400;
                this.data.isEnd = false;
            }
            else {
                this.data.isEnd = false;
                if (touchMove > this.data.slideItems) {
                    currentSlide = this.currentSlide + this.data.slideItems + (touchMove - this.data.slideItems);
                    itemSpeed = 200;
                }
                else {
                    currentSlide = this.currentSlide + this.data.slideItems;
                }
            }
            // console.log(divValue +","+ this.data.items +","+ itemLenght)
        }
        // console.log(translateXval);
        // console.log(this.carouselInner.offsetWidth +","+ this.data.items +","+ translateXval +","+ this.data.width);
        // tslint:disable-next-line:no-unused-expression
        this.inputs.animation === 'lazy' &&
            this.carouselAnimator(Btn, currentSlide + 1, currentSlide + this.data.items, itemSpeed, Math.abs(this.currentSlide - currentSlide));
        if (this.data.dexVal === 0) {
            var first = .5;
            var second = .50;
            // this.carouselInner.style.transition = `transform ${itemSpeed}ms ease-in-out`;
            // tslint:disable-next-line:max-line-length
            this.renderer.setElementStyle(this.carouselInner, 'transition', "transform " + itemSpeed + "ms cubic-bezier(" + first + ", " + second + ", 0.54, 1.13)");
        }
        else {
            var val = Math.abs(this.data.touch.velocity);
            var first = .7 / val < .5 ? .7 / val : .5;
            var second = (2.9 * val / 10 < 1.3) ? (2.9 * val) / 10 : 1.3;
            var somt = Math.floor((this.data.dexVal / val) / this.data.dexVal * (this.data.deviceWidth - this.data.dexVal));
            somt = somt > itemSpeed ? itemSpeed : somt;
            itemSpeed = somt < 200 ? 200 : somt;
            // console.log(this.data.dexVal / val);
            // console.log(Math.floor(somt * (this.data.deviceWidth - this.data.dexVal)));
            // console.log(itemSpeed / val / 10);
            // console.log(`transform ${itemSpeed}ms cubic-bezier(${first}, ${second}, 0.54, 1.13)`);
            // tslint:disable-next-line:max-line-length
            this.renderer.setElementStyle(this.carouselInner, 'transition', "transform " + itemSpeed + "ms cubic-bezier(" + first + ", " + second + ", 0.54, 1.13)");
            // this.carouselInner.style.transition = `transform ${itemSpeed}ms cubic-bezier(0.15, 1.04, 0.54, 1.13)`;
            this.data.dexVal = 0;
        }
        // cubic-bezier(0.15, 1.04, 0.54, 1.13)
        this.transformStyle(currentSlide);
        this.currentSlide = currentSlide;
        this.carouselPointActive();
        this.carouselLoad1();
        // const t1 = performance.now();
        // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    };
    CarouselComponent.prototype.transformStyle = function (valu) {
        var ret = '';
        if (this.data.type === 'responsive') {
            this.data.transform.xs = 100 / this.inputs.grid.xs * valu;
            this.data.transform.sm = 100 / this.inputs.grid.sm * valu;
            this.data.transform.md = 100 / this.inputs.grid.md * valu;
            this.data.transform.lg = 100 / this.inputs.grid.lg * valu;
            ret = "@media (max-width: 767px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.xs + "%, 0, 0); } }\n            @media (min-width: 768px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.sm + "%, 0, 0); } }\n            @media (min-width: 992px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.md + "%, 0, 0); } }\n            @media (min-width: 1200px) {\n              ." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.lg + "%, 0, 0); } }";
        }
        else {
            this.data.transform.all = this.inputs.grid.all * valu;
            ret = "." + this.data.classText + " .ngxcarousel-items { transform: translate3d(-" + this.data.transform.all + "px, 0, 0);";
        }
        this.carouselInner.querySelectorAll('style')[0].innerHTML = ret;
    };
    CarouselComponent.prototype.carouselLoad1 = function () {
        if (typeof this.inputs.load === 'number') {
            // tslint:disable-next-line:no-unused-expression
            (this.carouselItems.length - this.data.load) <= (this.currentSlide + this.data.items) &&
                this.carouselLoad.emit(this.currentSlide);
        }
    };
    CarouselComponent.prototype.makeid = function () {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    CarouselComponent.prototype.carouselInterval = function () {
        var _this = this;
        // console.log((this.inputs.type === 'mobile') +','+ (this.data.deviceWidth <= 767));
        // if (typeof this.inputs.interval === 'number' && typeof this.carouselInt !== 'object' && typeof this.carouselInt === 'undefined') {
        if (typeof this.inputs.interval === 'number') {
            this.renderer.listen(this.carouselMain, 'touchstart', function () {
                _this.renderer.setElementClass(_this.carousel, 'ngxcarouselTouched', true);
                // this.renderer.addClass(this.carousel, 'ngxcarouselTouched');
                _this.pauseinterval();
            });
            this.renderer.listen(this.carouselMain, 'touchend', function () {
                _this.renderer.setElementClass(_this.carousel, 'ngxcarouselTouched', false);
                // this.renderer.removeClass(this.carousel, 'ngxcarouselTouched');
                _this.pauseinterval();
            });
            this.renderer.listen(this.carouselMain, 'mouseenter', function () {
                _this.renderer.setElementClass(_this.carousel, 'ngxcarouselHovered', true);
                // this.renderer.addClass(this.carousel, 'ngxcarouselHovered');
                _this.pauseinterval();
            });
            this.renderer.listen(this.carouselMain, 'mouseleave', function () {
                _this.renderer.setElementClass(_this.carousel, 'ngxcarouselHovered', false);
                // this.renderer.removeClass(this.carousel, 'ngxcarouselHovered');
                _this.pauseinterval();
            });
            this.renderer.listenGlobal('window', 'scroll', function () {
                clearTimeout(_this.onScrolling);
                _this.onScrolling = setTimeout(function () {
                    _this.onWindowScrolling();
                }, 600);
            });
            this.carouselInt = setInterval(function () {
                // tslint:disable-next-line:no-unused-expression
                !(_this.carousel.classList.contains('ngxcarouselHovered')) &&
                    !(_this.carousel.classList.contains('pauseInterval')) &&
                    !(_this.carousel.classList.contains('ngxcarouselTouched')) &&
                    !(_this.carousel.classList.contains('ngxcarouselScrolled')) &&
                    !(_this.carousel.classList.contains('ngxcarouselMobiled')) &&
                    _this.carouselScroll(1);
            }, this.inputs.interval);
        }
    };
    CarouselComponent.prototype.pauseinterval = function () {
        var _this = this;
        // this.renderer.addClass(this.carousel, 'pauseInterval');
        this.renderer.setElementClass(this.carousel, 'pauseInterval', true);
        clearTimeout(this.pauseInterval);
        this.pauseInterval = setTimeout(function () {
            _this.renderer.setElementClass(_this.carousel, 'pauseInterval', false);
            // this.renderer.removeClass(this.carousel, 'pauseInterval');
        }, 4000);
    };
    CarouselComponent.prototype.carouselAnimator = function (direction, start, end, speed, length) {
        var _this = this;
        var val = length < 5 ? length : 5;
        val = val === 1 ? 3 : val;
        if (direction === 1) {
            for (var i = start - 1; i < end; i++) {
                val = val * 2;
                this.renderer.setElementStyle(this.carouselItems[i], 'transform', 'translateX(' + val + 'px)');
            }
        }
        else {
            for (var i = end - 1; i >= start - 1; i--) {
                val = val * 2;
                this.renderer.setElementStyle(this.carouselItems[i], 'transform', 'translateX(-' + val + 'px)');
            }
        }
        setTimeout(function () {
            for (var i = start - 1; i < end; i++) {
                _this.renderer.setElementStyle(_this.carouselItems[i], 'transform', 'translateX(0px)');
            }
        }, speed * .7);
    };
    return CarouselComponent;
}());
CarouselComponent.decorators = [
    { type: _angular_core.Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'ngx-carousel',
                template: "\n    <div class=\"som\">\n      <div class=\"ngxcarousel banner\">\n          <div class=\"ngxcarousel-inner\">\n              <div #firstDiv class=\"ngxcarousel-items\">\n                  <ng-content select=\".item\"></ng-content>\n              </div>\n              <div style=\"clear: both\"></div>\n          </div>\n          <ng-content select=\".leftRs\" class=\"leftRs\"></ng-content>\n          <ng-content select=\".rightRs\" class=\"rightRs\"></ng-content>\n      </div>\n      <div class=\"ngxcarouselPoint\" *ngIf=\"inputs.point\">\n          <ul>\n              <li *ngFor=\"let i of Arr(data.pointNumbers).fill(1)\"></li>\n          </ul>\n      </div>\n    </div>\n  ",
                styles: ["\n    .som {\n        width: 100%;\n        position: relative;\n    }\n\n    .ngxcarousel {\n        width: 100%;\n        position: relative;\n    }\n\n    .ngxcarousel-inner {\n        position: relative;\n        overflow: hidden;\n    }\n\n    .ngxcarousel-items {\n        white-space: nowrap;\n        position: relative;\n    }\n\n    .item {\n        display: inline-block;\n        white-space: initial;\n    }\n\n    .tile {\n        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n        margin: 5px;\n    }\n\n    .leftRs {\n        position: absolute;\n        margin: auto;\n        top: 0;\n        bottom: 0;\n        left: 0;\n        width: 50px;\n        height: 50px;\n        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);\n        border-radius: 999px;\n    }\n\n    .rightRs {\n        position: absolute;\n        margin: auto;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        width: 50px;\n        height: 50px;\n        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);\n        border-radius: 999px;\n    }\n\n    .banner .ngxcarouselPoint {\n        position: absolute;\n        width: 100%;\n        bottom: 20px;\n    }\n\n    .banner .ngxcarouselPoint li {\n        background: rgba(255, 255, 255, 0.55);\n    }\n\n    .banner .ngxcarouselPoint li.active {\n        background: white;\n    }\n\n    .ngxcarouselPoint ul {\n        list-style-type: none;\n        text-align: center;\n        padding: 12px;\n        margin: 0;\n        white-space: nowrap;\n        overflow: auto;\n    }\n\n    .ngxcarouselPoint ul li {\n        display: inline-block;\n        border-radius: 50%;\n        background: rgba(0, 0, 0, 0.55);\n        padding: 4px;\n        margin: 0 4px;\n        transition-timing-function: cubic-bezier(.17, .67, .83, .67);\n        transition: .4s;\n    }\n\n    .ngxcarouselPoint ul li.active {\n        background: #6b6b6b;\n        transform: scale(1.8);\n    }\n  "]
            },] },
];
/** @nocollapse */
CarouselComponent.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer, },
]; };
CarouselComponent.propDecorators = {
    'inputs': [{ type: _angular_core.Input },],
    'inputsLength': [{ type: _angular_core.Input },],
    'carouselInp': [{ type: _angular_core.Output },],
    'carouselLoad': [{ type: _angular_core.Output },],
    'onResizing': [{ type: _angular_core.HostListener, args: ['window:resize', ['$event'],] },],
    'ontouching': [{ type: _angular_core.HostListener, args: ['click', ['$event'],] },],
};

var CarouselModule = (function () {
    function CarouselModule() {
    }
    return CarouselModule;
}());
CarouselModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [CarouselComponent],
                exports: [CarouselComponent],
                imports: [_angular_common.CommonModule]
            },] },
];
/** @nocollapse */
CarouselModule.ctorParameters = function () { return []; };

var Carousel = (function () {
    function Carousel() {
    }
    return Carousel;
}());

exports.CarouselModule = CarouselModule;
exports.Carousel = Carousel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
