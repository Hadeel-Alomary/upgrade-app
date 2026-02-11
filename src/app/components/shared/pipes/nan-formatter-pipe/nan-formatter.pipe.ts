import { Pipe } from "@angular/core";

import {StringUtils} from '../../../../utils/index';

@Pipe({name: 'nanFormatter'})
export class NanFormatterPipe {
    transform(value:number) {
        return isNaN(value) ? '-' : value;
    }    
}
