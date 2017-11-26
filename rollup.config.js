export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/ngxcarousel.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng.ngxcarousel',
    external: ['@angular/core', '@angular/common', '@angular/platform-browser', 'hammerjs'],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/platform-browser': 'ng.platform-browser',
        'hammerjs': 'Hammer',
        'rxjs/Observable': 'Rx',
        'rxjs/ReplaySubject': 'Rx',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable'
    }
}