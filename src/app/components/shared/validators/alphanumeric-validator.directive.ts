import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[alphanumericValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: AlphanumericValidatorDirective, multi: true}],
    inputs: ['activated','allowDash']
})
export class AlphanumericValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    private allowDash: boolean;

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'alphanumeric-validator';
    }

    protected isValid(value:unknown):boolean {
        if(this.allowDash) {
            return /^[-_a-z0-9]+$/i.test(value as string);
        } else {
            return /^[_a-z0-9]+$/i.test(value as string);
        }
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.Alphanumeric, this.languageService);
    }

}

