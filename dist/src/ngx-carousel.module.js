var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { NgxCarouselItemDirective, NgxCarouselNextDirective, NgxCarouselPrevDirective } from './ngx-carousel/ngx-carousel.directive';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCarouselComponent } from './ngx-carousel/ngx-carousel.component';
import { NgxItemComponent } from './ngx-item/ngx-item.component';
import { NgxTileComponent } from './ngx-tile/ngx-tile.component';
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
}(HammerGestureConfig));
export { MyHammerConfig };
var NgxCarouselModule = (function () {
    function NgxCarouselModule() {
    }
    return NgxCarouselModule;
}());
export { NgxCarouselModule };
NgxCarouselModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
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
                    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
                ],
            },] },
];
/** @nocollapse */
NgxCarouselModule.ctorParameters = function () { return []; };
//# sourceMappingURL=ngx-carousel.module.js.map