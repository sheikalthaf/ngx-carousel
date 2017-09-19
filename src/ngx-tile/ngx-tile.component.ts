import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-tile',
  template: `<div class="item"><div class="tile"><ng-content></ng-content></div></div>`,
  styles: [`
    .item {
        display: inline-block;
        white-space: initial;
        padding: 10px;
    }

    .tile {
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }

    * {
        box-sizing: border-box;
    }
  `]
})
export class NgxTileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
