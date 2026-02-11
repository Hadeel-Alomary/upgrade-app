import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[lessThanOrEqualNumberValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: LessThanOrEqualNumberValidatorDirective, multi: true}],
    inputs: ['activated', 'maxNumber']
})
export class LessThanOrEqualNumberValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{
    maxNumber:number;//input

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'less-than-or-equal-number-validator';
    }

    protected isValid(value:unknown):boolean {
        return !isNaN(value as number) && (value as number) <= this.maxNumber;
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.LessThanOrEqualNumber, this.languageService, this.maxNumber.toString());
    }

}

