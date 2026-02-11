import { Pipe } from "@angular/core";
import {StringUtils} from '../../../../utils/index';

@Pipe({name: 'threeDigits'})
export class  ThreeDigitsNumberPipe {
    transform(value:number) {
        return StringUtils.format3DigitsNumber(value);
    }
}
