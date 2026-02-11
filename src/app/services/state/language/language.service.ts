import {Injectable} from '@angular/core';
import {LanguageType} from './language-type';
import {LanguageLoaderService} from '../../loader/language-loader/index';
import {StringUtils, Tc} from '../../../utils/index';

enum TranslateType {
    Element = 'translate',
    PlaceHolder = 'place-holder-translate',
    Title = 'title-translate'
}

@Injectable()

export class LanguageService{

    private static STORAGE_KEY:string = "TC_LANGUAGE";

    private language:LanguageType;
    private languageEntries:{[arabic:string]:string} = null;

    constructor(private languageLoaderService:LanguageLoaderService){
        let languageAsString:string = localStorage.getItem(LanguageService.STORAGE_KEY);
        this.language = languageAsString && languageAsString == "en" ? LanguageType.English : LanguageType.Arabic;
    }

    public get arabic():boolean {
        return this.language == LanguageType.Arabic;
    }

    public translate(arabic:string){
        if(this.arabic){
            return arabic;
        }

        // MA if it is non-arabic text, then no need to translate
        if(StringUtils.hasOnlyAsciiCharacters(arabic)){
            return arabic;
        }

        if(this.languageEntries[arabic] && 0 < this.languageEntries[arabic].length){
            return this.languageEntries[arabic];
        }

        if(this.languageEntries[arabic] == null) {
            this.languageLoaderService.addNewLanguageEntry(arabic);
            this.languageEntries[arabic] = "";
        }

        return arabic;
    }

    public getLanguage():LanguageType{
        return this.language;
    }

    public setLanguage(language:LanguageType):void{
        this.write(language);
    }

    public switchLanguage():void {
        let oppositeLanguage: LanguageType = this.language == LanguageType.Arabic ? LanguageType.English : LanguageType.Arabic;
        this.setLanguage(oppositeLanguage);
        window.location.pathname = this.replaceLanguageInCurrentUrl(); // change language url then redirect.
    }

    private replaceLanguageInCurrentUrl(): string {
        //Replaces language from url for example: tickerchart.net/app/ar -> tickerchart.net/app/en
        let oppositeLanguageString: string = this.language == LanguageType.Arabic ? 'en' : 'ar';
        let splitPath = window.location.pathname.split('/');
        splitPath[2] = oppositeLanguageString; // replacing language code with the new one
        return splitPath.join('/');
    }

    public translateHtml(element:JQuery):void {
        this.translateElement(element);
        this.translateElementPlaceHolder(element);
        this.translateElementTitle(element);
    }

    public getLanguageEntries(): Promise<{}> {
        // Load Language Entries
        return new Promise<{[arabic:string]:string}>((resolve, reject) => {

            if(this.arabic){
                //No need to wait for promise when App Language is Arabic
                return resolve({});
            }

            this.languageLoaderService.getLanguageEntries().subscribe(
                translation => {
                    this.languageEntries = Object.assign([], translation.entries);
                    resolve(this.languageEntries);
                },
                error => {
                    Tc.error('cannot load language entries.');
                }
            );
        });
    }

    private write(language: LanguageType):void {
        let languageAsString: string = language == LanguageType.Arabic ? "ar" : "en";
        localStorage.setItem(LanguageService.STORAGE_KEY, languageAsString);
    }

    /* Translate html */

    private translateElement(element:JQuery):void{
        $(element).find(`.${TranslateType.Element}`).text((index:number, oldText:string) => {
            return this.translate(oldText);
        });
    }

    private translateElementPlaceHolder(element:JQuery):void{
        $(element).find(`.${TranslateType.PlaceHolder}`).each((index:number, element:Element) => {
            $(element).attr("placeholder", this.translate($(element).attr("placeholder")));
        });
    }

    private translateElementTitle(element:JQuery):void{
        $(element).find(`.${TranslateType.Title}`).each((index:number, element:Element) => {
            $(element).attr("title", this.translate($(element).attr("title")));
        });
    }

}
