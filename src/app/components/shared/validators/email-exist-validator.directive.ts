import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {AbstractSyncValidator} from './abstract-sync-validator';
import {LanguageService} from '../../../services';

@Directive({
    standalone:true,
    selector: '[emailExistValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: EmailExistValidatorDirective, multi: true}],
    inputs: ['emailExistValid', 'emailNotExistValid']
})
export class EmailExistValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges {

    emailExistValid: boolean = true;
    emailNotExistValid: boolean = true;

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string {
        return 'available-validator';
    }

    protected isValid(value:string):boolean {
        return this.emailExistValid && this.emailNotExistValid;
    }

    protected getErrorMessage():string {
        let validationMsgType;
        if (!this.emailExistValid) {
            validationMsgType = ValidationMessageType.EmailExistError;
        } else if (!this.emailNotExistValid) {
            validationMsgType = ValidationMessageType.EmailNotExistError;
        }
        return ValidationMessage.getMessage(validationMsgType, this.languageService);
    }

}
