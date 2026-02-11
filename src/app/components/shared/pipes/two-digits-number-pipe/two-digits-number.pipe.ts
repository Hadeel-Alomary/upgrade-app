import { Pipe } from "@angular/core";

import {StringUtils} from '../../../../utils/index';

@Pipe({name: 'twoDigits'})
export class TwoDigitsNumberPipe {
    transform(value:number) {
        return StringUtils.format2DigitsNumber(value);
    }    
}
