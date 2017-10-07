# changelog [![NPM version](https://badge.fury.io/js/ngx-carousel.png)](http://badge.fury.io/js/ngx-carousel) 

### Before Upgrading once read the [Readme.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/README.md) file

## 1.2.0

### Changes

* From this build `inputsLength` Input and `dynamicLength` is removed.

* Added a new directive for the items `NgxCarouselItem` and it is mandatory. Check getstarted in readme.

* Added a new directive for buttons `NgxCarouselNext` and `NgxCarouselPrev`. it is mandatory. Check getstarted in readme.

* Removed buttons css for user customization. From this build `NgxCarouselNext` act as a rightRs and `NgxCarouselPrev` act as a leftRs. go and apply your own button with these directives. Check getstarted in readme.

### Issues fixed 

* Example is Updated in readme[#13](https://github.com/sheikalthaf/ngx-carousel/issues/13)

* buttons issue is fixed.[#12](https://github.com/sheikalthaf/ngx-carousel/issues/12)

* `ExpressionChangedAfterItHasBeenCheckedError` issue is fixed.[#11](https://github.com/sheikalthaf/ngx-carousel/issues/11)

* classList of undefined is fixed[#10](https://github.com/sheikalthaf/ngx-carousel/issues/10)

* touch slideing issue is fixed[#4](https://github.com/sheikalthaf/ngx-carousel/issues/4)

## 1.1.1

### Changes

* `CarouselModule` is renamed to `NgxCarouselModule` to match the name of the caroussel. Please change the name.
* `Carousel` interface is renamed to `NgxCarousel` to match the name of the caroussel. Please change the name.

## 1.1.0

### Features Added

* `loop: boolean` is added. By default it is false. It is used to control the looping of an item. If you need `interval: boolean` then make sure to to add `loop: true`. [#5](https://github.com/sheikalthaf/ngx-carousel/issues/5)

* `ngx-item` component is added for the replacement of the `.item` class. check readme.

* `ngx-tile` component is added for the replacement of the `.item` and `.tile` class. check readme.

* `easing: string` is added for custom easing style.

* Performance Improvements.

### RoadMap

* support for Angular Universal
* Custom Animation support
* Unsubcribe to carouselLoad Eventemitter

## 1.0.0

### Issues fixed

* Buttton error fixed based on the issue[#2](https://github.com/sheikalthaf/ngx-carousel/issues/2)

### Features Added

* This release now `all` feature is enabled. It will appear in `grid`. if you need to make your carousel items to be `fixed in width` use this option and makke other option to be `0`. eg `grid: {xs: 0, sm: 0, md: 0, lg: 0, all: 250}`

* touch control option included in this version, By default touch is false.
* Performance Improvements.

## 0.2.2

### This is a Major release with breaking Changes. Please read the [Readme.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/README.md) before upgrading


### Features Added

* This release now supports angular 2 projects (previously it requires angular 4).
* Performance Improvements



## 0.2.0

### This is a Major release with breaking Changes. Please read the [Readme.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/README.md) before upgrading

### This is a major release with api changes

* Renamed the Input() method from `items` to `inputs` with more option based on the feedback[#1](https://github.com/sheikalthaf/ngx-carousel/issues/1)
* `inputLenght` Inputs() added only for dynamicLenght is true
* Added `point` option to control carouselpoint
* Update your projects with below stucture when updatinng to this build

### Features Added

* Touch suport is added in this release with the help of `hammerjs`
* type `Carousel` is added to the `input` method so that the proper data will be passed to the carousel
* In this release the carousel is rewritten from directive to component so that the tags will be reduced and also some internal css chaanges


# 0.1.0

### This is a major release with api changes

* Updated the input method with more option
* Added `point` option to control carouselpoint
* Update your projects with below stucture when updatinng to this build