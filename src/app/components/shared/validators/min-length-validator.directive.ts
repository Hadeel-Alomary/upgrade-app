import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[minLengthValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: MinLengthValidatorDirective, multi: true}],
    inputs: ['activated', 'minLength']
})
export class MinLengthValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    private minLength:string;

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'min-length';
    }

    protected isValid(value:unknown):boolean {
        return (value as string).length >= +this.minLength;
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.MinLength, this.languageService, this.minLength.toString());
    }

}

