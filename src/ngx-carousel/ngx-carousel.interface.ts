export class NgxCarouselStore {
  type: string;
  deviceType?: string;
  classText: string;
  items: number;
  load: number;
  deviceWidth: number;
  carouselWidth: number;
  width: number;
  visibleItems: number;
  slideItems: number;
  itemWidthPer: number;
  transform: Transfrom;
  loop: boolean;
  dexVal: number;
  touchTransform: number;
  touch: Touch;
  isEnd: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export class Touch {
  active?: boolean;
  swipe: string;
  velocity: number;
}

export class Transfrom {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  all: number;
}

export class NgxCarousel {
  grid: Transfrom;
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
  easing?: string;
}

export type Custom = 'banner';
export type Animate = 'lazy';

