import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-item',
  template: `<div class="item"><ng-content></ng-content></div>`,
  styles: [`
    .item {
        display: inline-block;
        white-space: initial;
    }
  `]
})
export class NgxItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
