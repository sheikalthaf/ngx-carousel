export declare class NgxCarouselStore {
    type: string;
    deviceType: DeviceType;
    classText: string;
    items: number;
    load: number;
    deviceWidth: number;
    carouselWidth: number;
    itemWidth: number;
    visibleItems: ItemsControl;
    slideItems: number;
    itemWidthPer: number;
    itemLength: number;
    currentSlide: number;
    easing: string;
    speed: number;
    transform: Transfrom;
    loop: boolean;
    dexVal: number;
    touchTransform: number;
    touch: Touch;
    isEnd: boolean;
    isFirst: boolean;
    isLast: boolean;
}
export declare type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'all';
export declare class ItemsControl {
    start: number;
    end: number;
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
    point?: Point;
    type?: string;
    load?: number;
    custom?: Custom;
    loop?: boolean;
    touch?: boolean;
    easing?: string;
}
export declare type Custom = 'banner';
export declare type Animate = 'lazy';
export interface Point {
    visible: boolean;
    pointStyles?: string;
}
