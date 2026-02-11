import { Pipe } from "@angular/core";
import {LanguageService, LanguageType} from '../../../../services/index';

@Pipe({name: 'englishMarker'})
export class EnglishMarkerPipe {

    constructor(private languageService:LanguageService){}

    transform(value:string) {
        if(!value) {
            return value;
        }

        if(this.languageService.getLanguage() == LanguageType.English){
            return value;//NK no need to format it as english as you are in the english language application
        }

        return value.replace(/[A-Za-z0-9\]\[\(\)]+/g, '<span class="english">$&</span>');
    }    
}
