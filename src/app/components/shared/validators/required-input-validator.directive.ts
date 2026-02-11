import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[requiredInputValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: RequiredInputValidatorDirective, multi: true}],
    inputs: ['activated']
})
export class RequiredInputValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'input-required-validator';
    }

    protected isValid(value:unknown):boolean {
        return (value || value === 0) && (0 < (value as string|number).toString().trim().length);
    }
    
    protected getErrorMessage():string{
        return ValidationMessage.getMessage(ValidationMessageType.RequiredInput, this.languageService);
    }

    protected validIfNull():boolean {
        return false;
    }

}

