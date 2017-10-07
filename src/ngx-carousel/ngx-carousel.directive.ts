import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NgxCarouselItem]'
})
export class NgxCarouselItemDirective { }


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NgxCarouselNext]'
})
export class NgxCarouselNextDirective { }

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NgxCarouselPrev]'
})
export class NgxCarouselPrevDirective { }
