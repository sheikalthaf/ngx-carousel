import { Component } from '@angular/core';
var NgxItemComponent = (function () {
    function NgxItemComponent() {
    }
    NgxItemComponent.prototype.ngOnInit = function () {
    };
    return NgxItemComponent;
}());
export { NgxItemComponent };
NgxItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-item',
                template: "<div class=\"item\"><ng-content></ng-content></div>",
                styles: ["\n    .item {\n        display: inline-block;\n        white-space: initial;\n    }\n  "]
            },] },
];
/** @nocollapse */
NgxItemComponent.ctorParameters = function () { return []; };
//# sourceMappingURL=ngx-item.component.js.map