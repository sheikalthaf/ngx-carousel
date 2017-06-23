import { NgModule } from '@angular/core';
import { CarouselDirective } from './carousel.directive';

export { CarouselDirective } from './carousel.directive';

@NgModule({
  declarations: [CarouselDirective],
  exports: [CarouselDirective]
})
export class CarouselModule { }