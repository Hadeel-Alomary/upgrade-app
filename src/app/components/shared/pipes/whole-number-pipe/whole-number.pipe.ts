import { Pipe } from "@angular/core";

import {StringUtils} from '../../../../utils/index';

@Pipe({name: 'whole'})
export class WholeNumberPipe {
    transform(value:number) {
        return StringUtils.formatWholeNumber(value);
    }    
}
