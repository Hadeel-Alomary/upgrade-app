import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService} from '../../../services/index';
import {AbstractSyncValidator} from './abstract-sync-validator';

@Directive({
    selector: '[manualErrorValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: ManualErrorValidatorDirective, multi: true}],
    inputs: ['required', 'manualError']
})
export class ManualErrorValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges{

    manualError:string = '';

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string{
        return 'manual-error-validator';
    }

    protected isValid(value:unknown):boolean {
        return !this.manualError || this.manualError.trim() == '';
    }

    protected getErrorMessage():string{
        return this.manualError;
    }

}

