// https://github.com/angular/zone.js/blob/master/NON-STANDARD-APIS.md#currently-supported-non-standard-common-apis
// to tell zone.js support bluebird
import 'zone.js';
import 'zone.js/dist/zone';  // Included with Angular CLI.
import 'zone.js/dist/long-stack-trace-zone';

// tslint:disable no-string-literal
// console.log(window['Promise']);
// console.log(Promise);

// https://github.com/angular/zone.js/issues/455#issuecomment-285749589
// https://github.com/angular/zone.js/pull/655
import Bluebird from 'bluebird';

Bluebird.config(
    {
        // warnings: false,
        // longStackTraces: false,
        // cancellation: true,
        // monitoring: false
    }
);


import 'zone.js/dist/zone-bluebird';
// tslint:disable no-string-literal
// @ts-ignore
Zone[Zone['__symbol__']('bluebird')](Bluebird);

// console.log(Zone);
// console.log(window['Promise']);
// console.log(Promise);

// @ts-ignore
// console.log(Promise === Bluebird);
console.log('(Promise === Bluebird):', Promise === Bluebird);

// console.log(window['performance']);
// console.log(Zone.assertZonePatched);
// console.log(Zone.assertZonePatched['toSource']());
// https://github.com/angular/zone.js/issues/455#issuecomment-285749589
// tslint:disable only-arrow-functions
Zone.assertZonePatched = function() {
};

import {config as RxJsConfig} from 'rxjs';

RxJsConfig.Promise = Promise;

import 'zone.js/dist/zone-patch-rxjs';
// import 'zone.js/dist/zone-patch-rxjs-fake-async';


