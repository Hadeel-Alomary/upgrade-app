import { Pipe } from "@angular/core";
import {LanguageService} from '../../../../services/index';

@Pipe({name: 'translate'})
export class LanguageTranslatePipe {
    constructor(private languageService:LanguageService){}

    transform(value:string) {
        if(!value){
            return value;
        }
        return this.languageService.translate(value);
    }
}
