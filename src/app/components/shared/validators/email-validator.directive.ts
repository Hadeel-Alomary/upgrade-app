import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[emailValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true}],
    inputs: ['activated']
})
export class EmailValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    private emailRegex: RegExp = /^[a-zA-Z0-9\._\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/;
    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'email-validator';
    }

    protected isValid(value:unknown):boolean {
        return this.emailRegex.test(value as string);
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.Email, this.languageService);
    }

}

