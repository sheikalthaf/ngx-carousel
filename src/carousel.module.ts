import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';

export { CarouselComponent } from './carousel.component';

@NgModule({
  declarations: [CarouselComponent],
  exports: [CarouselComponent],
  imports: [CommonModule]
})

export class CarouselModule { }
