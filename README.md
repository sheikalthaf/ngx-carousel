# ngx-carousel

Lightweight and simple carousel for angular.

`Note: This carousel doesn't include any css. go and customize css for buttons, items except ngxcarousel and ngxcarousel-inner`

## changelog [![NPM version](https://badge.fury.io/js/ngx-carousel.png)](http://badge.fury.io/js/ngx-carousel) 

This is a major release with api changes
1. Updated the input method with more option
2. Added `point` option to control carouselpoint
3. Update your projects with below stucture when updatinng to this build


## Installation

[![npm install ngx-carousel](https://nodei.co/npm/ngx-carousel.png)](http://npmjs.org/package/ngx-carousel)

`npm install ngx-carousel --save`

## Sample

Include CarouselModule in your app module:

```javascript
import { CarouselModule } from 'ngx-carousel';

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

@Component({
  selector: 'sample',
  template: `
    <div carousel class="ngxcarousel"
        [items]="carouselOne"
        (carouselLoad)="myfunc($event)">
      <div class="ngxcarousel-inner">
        <div class="item">
          ....
        </div>
        <div class="item">
          ....
        </div>
        <div class="item">
          ....
        </div>
      </div>
      <button class='leftRs'><</button>
      <button class='rightRs'>></button>
    </div>
  `,
})
export class Sample implements OnInit {

  public carouselOne: object;

  this.carouselOne = {
      'items': '1-1-1-1',
      'slide': 1,
      'speed': 400,
      'interval': 4000,
      'animation': '',
      'point': true,
      'load': 2,
      'custom': 'banner'
    }

  public myfunc(event: Event) {
     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel
  }
  
  
  }

}
```

## items

```
type: string
```

eg. "items" : "xs-sm-md-lg"

`items` value should be mentioned


## slide

```
type: number

default: 'items' screen value
```

eg. "slide" : "2"

`slide` value is used to slide the number items on click

## speed

```
type: milli seconds

default: 400
```

eg. "speed" : "600"

`speed` value is used for time taken to slide the number items

## interval

```
type: milli seconds

default: no default
```

eg. "interval" : "6000"

`interval` value is used to make carousel auto slide with given value. interval defines the interval between slides

## load

```
type: number

default: no default
```

eg. "load" : "5"

`load` is used to load the items similar to pagination. the carousel will tigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.

```javascript
(carouselLoad)="myfunc($event)"

```

## point

```
type: boolean

default: false
```

eg. "point" : true

`point` is used to indicate no. of slides and also shows the current active slide.


## animation

```
type: string

default: no default
```

eg. "animation" : "lazy"

`animation` is used to animate the sliding items. currently it only supports `lazy`. more coming soon and also with custom css animation option

## custom

```
type: string

default: no default
```

eg. "custom" : "banner"

`custom` is you to define the purpose of the carousel. currently it only supports `banner, tile`. more coming soon and also with custom css animation option

# Getstarted guide

## Banner


```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'sample',
  template: `
    <div class="ngxcarousel banner" carousel 
      [inputs]="carouselBanner" 
      (carouselLoad)="carouselBannerLoad($event)">

        <div class="ngxcarousel-inner">

            <div class="item" *ngFor="let Banner of carouselBannerItems">
                <div>
                    <h1>{{Banner + 1}}</h1>
                </div>
            </div>

        </div>
        <button class='leftRs'><</button>
        <button class='rightRs'>></button>
    </div>
  `,
})
export class Sample implements OnInit {

  public carouselBannerItems: Array<any>;
  public carouselBanner: object;
  
  ngOnInit(){
    this.carouselBannerItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    this.carouselBanner = {
      'items': '1-1-1-1',
      'slide': 1,
      'speed': 400,
      'interval': 4000,
      'animation': '',
      'point': true,
      'load': 2,
      'custom': 'banner'
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

css required to style the items. just apply some css to Items inner div

```css
.bannerStyle {
  min-height: 300px;
  background-color: #ccc;
  text-align: center;
}
```


## Tile


```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'sample',
  template: `
    <div class="ngxcarousel" carousel 
      [inputs]="carouselTile" 
      (carouselLoad)="carouselTileLoad($event)">

        <div class="ngxcarousel-inner">

            <div class="item" *ngFor="let Tile of carouselTileItems">
                <div>
                    <h1>{{Tile + 1}}</h1>
                </div>
            </div>

        </div>
        <button class='leftRs'><</button>
        <button class='rightRs'>></button>
    </div>
  `,
})
export class Sample implements OnInit {
  
  public carouselTileItems: Array<any>;
  public carouselTile: object;
  
  ngOnInit(){
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    this.carouselTile = {
      'items': '1-2-3-4',
      'slide': 2,
      'speed': 700,
      'interval': 4000,
      'animation': 'lazy',
      'point': true,
      'load': 2,
      'custom': 'tile'
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


css required to style the items. just apply some css to Items inner div

```css
.tile {
  min-height: 200px;
  background-color: #ccc;
  text-align: center;
}
```

## License
[MIT](LICENSE) license.