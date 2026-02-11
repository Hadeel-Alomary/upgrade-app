import { Pipe } from "@angular/core";

import {DomSanitizer} from '@angular/platform-browser';

// MA suggested by https://github.com/angular/angular/issues/8491
@Pipe({name: 'safeStyle'})
export class SafeStylePipe {
    constructor( public sanitizer:DomSanitizer){ }
    transform(style:string) {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }    
}
