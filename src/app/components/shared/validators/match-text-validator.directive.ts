import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    standalone:true,
    selector: '[matchTextValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: MatchTextValidatorDirective, multi: true}],
    inputs: ['activated', 'matchingText']
})
export class MatchTextValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    private matchingText:string;

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'match-validator';
    }

    protected isValid(value:unknown):boolean {
        return this.matchingText === value;
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.MatchText, this.languageService);
    }

}

