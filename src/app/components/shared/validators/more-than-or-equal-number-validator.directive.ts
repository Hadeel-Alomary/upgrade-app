import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    standalone:true,
    selector: '[moreThanOrEqualNumberValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: MoreThanOrEqualNumberValidatorDirective, multi: true}],
    inputs: ['activated', 'minNumber']
})
export class MoreThanOrEqualNumberValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    minNumber:number;//input

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'more-than-or-equal-number-validator';
    }

    protected isValid(value:number):boolean {
        return !isNaN(value) && this.minNumber <= (value as number);
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.MoreThanOrEqualNumber, this.languageService, this.minNumber.toString());
    }

}

