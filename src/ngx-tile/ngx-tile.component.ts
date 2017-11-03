import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-tile',
  template: `<div class="tile"><ng-content></ng-content></div>`,
  styles: [`
    :host {
        display: inline-block;
        white-space: initial;
        padding: 10px;
        box-sizing: border-box;
        vertical-align: top;
    }

    .tile {
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }

    * {
        box-sizing: border-box;
    }
  `]
})
export class NgxTileComponent {
  @HostBinding('class') classes = 'item';
}
