import { Pipe } from "@angular/core";

import {StringUtils} from '../../../../utils/index';

@Pipe({name: 'percent'})
export class PercentNumberPipe {
    transform(value:number) {
        if(isNaN(value)){
            return '-';
        }
        return `${StringUtils.format2DigitsNumber(value)} %`;
    }    
}
