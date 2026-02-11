import { Pipe } from "@angular/core";

import {DomSanitizer} from '@angular/platform-browser';

// MA suggested by https://github.com/angular/angular/issues/8491
@Pipe({name: 'safeUrl'})
export class SafeUrlPipe {
    constructor( public sanitizer:DomSanitizer){ }
    transform(url:string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }    
}
