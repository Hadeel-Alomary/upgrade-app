import { Pipe } from "@angular/core";
import {StringUtils} from '../../../../utils/index';

@Pipe({name: 'variableDigits'})
export class VariableDigitsNumberPipe {
    transform(value:number) {
        return StringUtils.formatVariableDigitsNumber(value);
    }
}
