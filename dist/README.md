# ngx-carousel

Lightweight and simple carousel for angular.

`Note: This carousel doesn't include any css. go and customize css for buttons, items except ngxcarousel and ngxcarousel-inner`

## changelog [![NPM version](https://badge.fury.io/js/ngx-carousel.png)](http://badge.fury.io/js/ngx-carousel) 

for ChangeLog go to [CHANGELOG.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/CHANGELOG.md)


## Installation


`npm install ngx-carousel --save`

Now ngx-carousel supports touch with the help of hammerjs

`npm install hammerjs --save`

## Sample

Include CarouselModule in your app module:

```javascript
import { CarouselModule } from 'ngx-carousel';
import 'hammerjs';

@NgModule({
  imports: [
    CarouselModule
  ],
})
export class AppModule { }
```

Then use in your component:

```javascript
import { Component } from '@angular/core';
import { Carousel } from 'ngx-carousel';

@Component({
  selector: 'sample',
  template: `
    <ngx-carousel 
        [inputs]="carouselOne"
        [inputsLength]="carouselTwoItems.length"
        (carouselLoad)="myfunc($event)">
          <div class="item">
            ....
          </div>
          <div class="item">
            ....
          </div>
          <div class="item">
            ....
          </div>
      <button class='leftRs'><</button>
      <button class='rightRs'>></button>
    </ngx-carousel>
  `,
})
export class SampleComponent implements OnInit {

  public carouselOne: Carousel;

  ngOnInit() {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: true,
      load: 2,
      touch: true,
      custom: 'banner',
      dynamicLength: true
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


export class Carousel {
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
  touch?: boolean;
  dynamicLength: boolean;
}

export class Grid {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  all: number;
}

export type Custom = 'banner' | 'tile';
export type Animate = 'lazy';


```

## grid

```
type: object
```

eg. grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0}

xs - mobile,
sm - tablet,
md - desktop,
lg - large desktops,
all - fixed width (Experimental don't use now, make it 0 always)

`grid` value must be mentioned


## slide

```
type: number

default: 'grid' screen value
```

eg. slide : 2

`slide` value is used to slide the number items on click

## speed

```
type: milli seconds

default: 400
```

eg. speed : 600

`speed` value is used for time taken to slide the number items

## interval

```
type: milli seconds

default: no default
```

eg. interval : 6000

`interval` value is used to make carousel auto slide with given value. interval defines the interval between slides

## load

```
type: number

default: no default
```

eg. load : 5

`load` is used to load the items similar to pagination. the carousel will tigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.

```javascript
(carouselLoad)="myfunc($event)"

```

## point

```
type: boolean

default: false
```

eg. point : true

`point` is used to indicate no. of slides and also shows the current active slide.



## touch

```
type: boolean

default: false
```

eg. touch : true

`touch` is used to active touch support to the carousel.




## animation

```
type: string

default: no default
```

eg. animation : "lazy"

`animation` is used to animate the sliding items. currently it only supports `lazy`. more coming soon and also with custom css animation option

## custom

```
type: string

default: no default
```

eg. custom : "banner"

`custom` is you to define the purpose of the carousel. currently it only supports `banner, tile`. more coming soon and also with custom css animation option

# Getstarted guide

## Banner


```javascript
import { Component } from '@angular/core';
import { Carousel } from 'ngx-carousel';

@Component({
  selector: 'sample',
  template: `
    <ngx-carousel  
      [inputs]="carouselBanner" 
      [inputsLength]="carouselBannerItems.length"
      (carouselLoad)="carouselBannerLoad($event)">

            <div class="item bannerStyle" *ngFor="let Banner of carouselBannerItems">
                <h1>{{Banner + 1}}</h1>
            </div>

        <button class='leftRs'><</button>
        <button class='rightRs'>></button>
    </ngx-carousel>
  `,
  styles: [`
    .bannerStyle {
      min-height: 300px;
      background-color: #ccc;
    }

    .bannerStyle h1 {
      text-align: center;
      line-height: 300px;
    }
  `]
})
export class Sample implements OnInit {

  public carouselBannerItems: Array<any>;
  public carouselBanner: Carousel;
  
  ngOnInit(){
    this.carouselBannerItems = [0, 1, 2, 3, 4];
    
    this.carouselBanner = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: true,
      load: 2,
      custom: 'banner',
      touch: true,
      dynamicLength: true
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
import { Carousel } from 'ngx-carousel';

@Component({
  selector: 'sample',
  template: `
    <ngx-carousel 
      [inputs]="carouselTile" 
      [inputsLength]="carouselTileItems.length"
      (carouselLoad)="carouselTileLoad($event)">

            <div class="item" *ngFor="let Tile of carouselTileItems">
                <div class="tile">
                    <h1>{{Tile + 1}}</h1>
                </div>
            </div>

        <button class='leftRs'><</button>
        <button class='rightRs'>></button>
    </ngx-carousel>
  `,
  styles: [`
    .tile {
      min-height: 200px;
      background-color: #ccc;
    }

    .tile h1{
      text-align: center;
      line-height: 200px;
    }
  `]
})
export class Sample implements OnInit {
  
  public carouselTileItems: Array<any>;
  public carouselTile: Carousel;
  
  ngOnInit(){
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    this.carouselTile = {
      grid: {xs: 2, sm: 3, md: 3, lg: 3, all: 0},
      slide: 2,
      speed: 400,
      interval: 3000,
      animation: 'lazy',
      point: true,
      load: 2,
      touch: true,
      custom: 'tile',
      dynamicLength: true
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