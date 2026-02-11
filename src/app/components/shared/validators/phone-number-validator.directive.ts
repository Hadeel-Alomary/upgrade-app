import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[phoneNumberValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: PhoneNumberValidatorDirective, multi: true}],
    inputs: ['activated', 'countryCode']
})
export class PhoneNumberValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{
    countryCode:string;//Input

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'phone-number-validator';
    }

    protected isValid(value:string):boolean {
        return this.phoneRegex.test(value);
    }

     get phoneRegex():RegExp{
        return this.countryCode == '+966' ? /^5\d{8}$/ : /^[^0]\d{6,}$/;
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.PhoneNumber, this.languageService);
    }

}

