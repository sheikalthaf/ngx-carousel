import { Component, HostBinding } from '@angular/core';
var NgxItemComponent = (function () {
    function NgxItemComponent() {
        this.classes = 'item';
    }
    return NgxItemComponent;
}());
export { NgxItemComponent };
NgxItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-item',
                template: "<ng-content></ng-content>",
                styles: ["\n    :host {\n        display: inline-block;\n        white-space: initial;\n        vertical-align: top;\n    }\n  "]
            },] },
];
/** @nocollapse */
NgxItemComponent.ctorParameters = function () { return []; };
NgxItemComponent.propDecorators = {
    'classes': [{ type: HostBinding, args: ['class',] },],
};
//# sourceMappingURL=ngx-item.component.js.map