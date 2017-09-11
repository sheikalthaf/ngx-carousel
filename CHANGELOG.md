
## changelog [![NPM version](https://badge.fury.io/js/ngx-carousel.png)](http://badge.fury.io/js/ngx-carousel) 


# 1.0.0

### Before Upgrading once read the [Readme.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/README.md) file

### Issues fixed

* Buttton error fixed based on the issue[#2](https://github.com/sheikalthaf/ngx-carousel/issues/2)


### Features Added

* This release now `all` feature is enabled. It will appear in `grid`. if you need to make your carousel items to be `fixed in width` use this option and makke other option to be `0`. eg `grid: {xs: 0, sm: 0, md: 0, lg: 0, all: 250}`

* touch control option included in this version, By default touch is false.
* Performance Improvements.

### RoadMap

* support for Angular Universal
* Custom Animation support
* Unsubcribe to carouselLoad Eventemitter


# 0.2.2

### This is a Major release with breaking Changes. Please read the [Readme.md](https://github.com/sheikalthaf/ngx-carousel/blob/master/README.md) before upgrading


### Features Added

* This release now supports angular 2 projects (previously it requires angular 4).
* Performance Improvements



# 0.2.0

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