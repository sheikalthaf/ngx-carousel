import { Component } from '@angular/core';
var NgxTileComponent = (function () {
    function NgxTileComponent() {
    }
    NgxTileComponent.prototype.ngOnInit = function () {
    };
    return NgxTileComponent;
}());
export { NgxTileComponent };
NgxTileComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-tile',
                template: "<div class=\"item\"><div class=\"tile\"><ng-content></ng-content></div></div>",
                styles: ["\n    .item {\n        display: inline-block;\n        white-space: initial;\n        padding: 10px;\n    }\n\n    .tile {\n        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    }\n\n    * {\n        box-sizing: border-box;\n    }\n  "]
            },] },
];
/** @nocollapse */
NgxTileComponent.ctorParameters = function () { return []; };
//# sourceMappingURL=ngx-tile.component.js.map