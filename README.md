# ngx-carousel

Lightweight and simple carousel for angular.

## Installation

`npm install ngx-carousel --save`

## Sample

Include CarouselModule in your app module:

```javascript
import { CarouselModule } from 'ngx-carousel';

@NgModule({
  imports:      [
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
        [items]="'1-2-3-4'"
        [slide]="2"
        [speed]="600"
        [interval]="5000"
        [load]="3"
        [animation]="'lazy'"
        [custom]="'banner'"
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

  
  public myfunc(event: Event) {
     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel
  }
  
  
  }

}
```

## [items]

```
type: string
```

eg. [items]="'xs-sm-md-lg'"

`items` value should be within single qoutes


## [slide]

```
type: number

default: [items] screen value
```

eg. [slide]="2"

`slide` value is used to slide the number items on click

## [speed]

```
type: milli seconds

default: 400
```

eg. [speed]="600"

`speed` value is used for time taken to slide the number items

## [interval]

```
type: milli seconds

default: no default
```

eg. [interval]="6000"

`interval` value is used to make carousel auto slide with given value. interval defines the interval between slides

## [load]

```
type: number

default: no default
```

eg. [load]="5"

`load` is used to load the items similar to pagination. the carousel will tigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.

```javascript
(carouselLoad)="myfunc($event)"

```

## [animation]

```
type: string

default: no default
```

eg. [animation]="'lazy'"

`animation` is used to animate the sliding items. currently it only supports `'lazy'`. more coming soon and also with custom css animation option

## [custom]

```
type: string

default: no default
```

eg. [custom]="'lazy'"

`custom` is you to define the purpose of the carousel. currently it only supports `'banner','tile'`. more coming soon and also with custom css animation option

## License
[MIT](LICENSE) license.