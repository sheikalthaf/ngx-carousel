import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-item',
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
        display: inline-block;
        white-space: initial;
        vertical-align: top;
    }
  `]
})
export class NgxItemComponent {
  @HostBinding('class') classes = 'item';
}
