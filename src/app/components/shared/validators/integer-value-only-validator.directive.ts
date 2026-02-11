import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    standalone:true,
    selector: '[integerValueValidator][ngModel]',
    // providers: [{provide: NG_VALIDATORS, useExisting: IntegerValueOnlyValidatorDirective, multi: true}],
    inputs: ['activated']
})
export class IntegerValueOnlyValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'integer-value-validator';
    }

    protected isValid(value:unknown):boolean {
        return !isNaN(value as number) && (value as number) % 1 === 0;
    }

    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.IntegerValueOnly, this.languageService);
    }

}

