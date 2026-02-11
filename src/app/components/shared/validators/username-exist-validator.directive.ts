import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {AbstractSyncValidator} from './abstract-sync-validator';
import {LanguageService} from '../../../services';

@Directive({
    standalone:true,
    selector: '[usernameExistValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: UsernameExistValidatorDirective, multi: true}],
    inputs: ['usernameExistValid', "usernameNotExistValid"]
})
export class UsernameExistValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges {

    usernameExistValid: boolean = true;
    usernameNotExistValid: boolean = true;

    constructor(public el:ElementRef, private languageService:LanguageService){
        super(el);
    }

    protected getErrorClassName():string {
        return 'available-validator';
    }

    protected isValid(value:string):boolean {
        return this.usernameExistValid && this.usernameNotExistValid;
    }

    protected getErrorMessage():string {
        let validationMsgType;
        if (!this.usernameExistValid) {
            validationMsgType = ValidationMessageType.UsernameExistError;
        } else if (!this.usernameNotExistValid) {
            validationMsgType = ValidationMessageType.UsernameNotExistError;
        }
        return ValidationMessage.getMessage(validationMsgType, this.languageService);
    }

}
