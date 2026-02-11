import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {AbstractSyncValidator} from './abstract-sync-validator';
import {LanguageService} from '../../../services';

@Directive({
    selector: '[mobileExistValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: MobileExistValidatorDirective, multi: true}],
    inputs: ['mobileExistValid', 'mobileNotExistValid']
})
export class MobileExistValidatorDirective extends AbstractSyncValidator implements Validator, AfterViewInit, OnChanges {

    mobileExistValid: boolean = true;
    mobileNotExistValid: boolean = true;

    constructor(public el:ElementRef, private languageService:LanguageService) {
        super(el);
    }

    protected getErrorClassName():string {
        return 'available-validator';
    }

    protected isValid(value:string):boolean {
        return this.mobileExistValid && this.mobileNotExistValid;
    }

    protected getErrorMessage():string {
        let validationMsgType;
        if (!this.mobileExistValid) {
            validationMsgType = ValidationMessageType.MobileExistError;
        } else if (!this.mobileNotExistValid) {
            validationMsgType = ValidationMessageType.MobileNotExistError;
        }
        return ValidationMessage.getMessage(validationMsgType, this.languageService);
    }

}
