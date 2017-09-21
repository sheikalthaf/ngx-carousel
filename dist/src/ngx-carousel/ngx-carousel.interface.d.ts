export declare class CarouselStore {
    type: string;
    deviceType?: string;
    classText: string;
    items: number;
    load: number;
    deviceWidth: number;
    carouselWidth: number;
    width: number;
    pointNumbers: number;
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
export declare class Touch {
    active?: boolean;
    swipe: string;
    velocity: number;
}
export declare class Transfrom {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    all: number;
}
export declare class NgxCarousel {
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
    dynamicLength: boolean;
}
export declare type Custom = 'banner' | 'tile';
export declare type Animate = 'lazy';
