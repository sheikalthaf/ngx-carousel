# ngx-carousel

Lightweight and simple carousel for angular.

`Note: This carousel doesn't include any css. go and customize css for buttons, items except ngxcarousel and ngxcarousel-inner`

## changelog [![NPM version](https://badge.fury.io/js/ngx-carousel.png)](http://badge.fury.io/js/ngx-carousel) 

for ChangeLog go to [CHANGELOG.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/CHANGELOG.md)

 
## Demo

Demo available [Here](https://sheikalthaf.github.io/ngx-carousel)


## Installation


`npm install ngx-carousel --save`

Now ngx-carousel supports touch with the help of hammerjs

`npm install hammerjs --save`

## Sample

Include CarouselModule in your app module:

```javascript
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

@NgModule({
  imports: [
    NgxCarouselModule
  ],
})
export class AppModule { }
```

Then use in your component:

```javascript
import { Component } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'sample',
  template: `
    <ngx-carousel 
        [inputs]="carouselOne"
        (carouselLoad)="myfunc($event)">
          <ngx-item NgxCarouselItem>
            ....
          </ngx-item>
          <ngx-item NgxCarouselItem>
            ....
          </ngx-item>
          <ngx-item NgxCarouselItem>
            ....
          </ngx-item>
          <button NgxCarouselPrev class='leftRs'>&lt;</button>
          <button NgxCarouselNext class='rightRs'>&gt;</button>
    </ngx-carousel>
  `,
})
export class SampleComponent implements OnInit {

  public carouselOne: NgxCarousel;

  ngOnInit() {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: true,
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }

  public myfunc(event: Event) {
     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel
  }


}
```

## Input Interface

```javascript


export class NgxCarousel {
  grid: Grid;
  slide?: number;
  speed?: number;
  interval?: number;
  animation?: Animate;
  point?: boolean;
  type?: string;
  load?: number;
  custom?: Custom;
  loop?: boolean;
  easing: string;
  touch?: boolean;
}

export class Grid {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  all: number;
}

export type Custom = 'banner';
export type Animate = 'lazy';


```

| Command | Type | Required | Description |
| --- | --- | --- | --- |
| `grid` | Object | Yes | **xs** - mobile, **sm** - tablet, **md** - desktop, **lg** - large desktops, **all** - fixed width (When you use **all** make others 0 and vise versa) |
| `slide` | number | optional | It is used to slide the number items on click |
| `speed` | milli seconds | optional | It is used for time taken to slide the number items |
| `interval` | milli seconds | optional | It is used to make carousel auto slide with given value. interval defines the interval between slides |
| `load` | number | optional | is used to load the items similar to pagination. the carousel will tigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.**`(carouselLoad)="myfunc($event)"`** |
| `point` | boolean | optional | It is used to indicate no. of slides and also shows the current active slide. |
| `touch` | boolean | optional | It is used to active touch support to the carousel. |
| `easing` | string | optional | It is used to define the easing style of the carousel. Only define the ease name without any timing like `ease`,`ease-in` |
| `loop` | boolean | optional | It is used to loop the `ngx-item | ngx-tile`. It must be true for `interval` |
| `animation` | string | optional | It is used to animate the sliding items. currently it only supports `lazy`. more coming soon and also with custom css animation option |
| `custom` | string | optional | It is you to define the purpose of the carousel. currently it only supports `banner`. more coming soon and also with custom css animation option |




# Getstarted guide

## Banner


```javascript
import { Component } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-carousel',
  template: `
    <ngx-carousel  
      [inputs]="carouselBanner" 
      (carouselLoad)="carouselBannerLoad($event)">

          <ngx-item NgxCarouselItem class="bannerStyle" *ngFor="let Banner of carouselBannerItems">
              <h1>{{Banner + 1}}</h1>
          </ngx-item>

          <button NgxCarouselPrev class='leftRs'>&lt;</button>
          <button NgxCarouselNext class='rightRs'>&gt;</button>
    </ngx-carousel>
  `,
  styles: [`
    .bannerStyle h1 {
        background-color: #ccc;
        min-height: 300px;
        text-align: center;
        line-height: 300px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
  `]
})
export class Sample implements OnInit {

  public carouselBannerItems: Array<any>;
  public carouselBanner: NgxCarousel;

  ngOnInit(){
    this.carouselBannerItems = [0, 1, 2, 3, 4];

    this.carouselBanner = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: true,
      load: 2,
      loop: true,
      custom: 'banner',
      touch: true
    }
  }

  public carouselBannerLoad(evt: any) {

    const len = this.carouselBannerItems.length
    if (len <= 10) {
      for (let i = len; i < len + 10; i++) {
        this.carouselBannerItems.push(i);
      }
    }

  }

     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel
}

```



## Tile


```javascript
import { Component } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-carousel',
  template: `
    <ngx-carousel 
      [inputs]="carouselTile" 
      (carouselLoad)="carouselTileLoad($event)">

            <ngx-tile NgxCarouselItem *ngFor="let Tile of carouselTileItems">
                <h1>{{Tile + 1}}</h1>
            </ngx-tile>

          <button NgxCarouselPrev class='leftRs'>&lt;</button>
          <button NgxCarouselNext class='rightRs'>&gt;</button>
    </ngx-carousel>
  `,
  styles: [`

    h1{
      min-height: 200px;
      background-color: #ccc;
      text-align: center;
      line-height: 200px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
  `]
})
export class Sample implements OnInit {

  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;

  ngOnInit(){
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    this.carouselTile = {
      grid: {xs: 2, sm: 3, md: 3, lg: 5, all: 0},
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: true,
      load: 2,
      touch: true,
      easing: 'ease'
    }
  }

  public carouselTileLoad(evt: any) {

    const len = this.carouselTileItems.length
    if (len <= 30) {
      for (let i = len; i < len + 10; i++) {
        this.carouselTileItems.push(i);
      }
    }

  }

     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel

}
```

## License

[MIT](LICENSE) license.