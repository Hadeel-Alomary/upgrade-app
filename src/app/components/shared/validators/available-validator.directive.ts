import {AfterViewInit, Directive, ElementRef, OnChanges} from '@angular/core';
import {AsyncValidator, NG_ASYNC_VALIDATORS} from '@angular/forms';
import {ValidationMessage, ValidationMessageType} from './validation-message';
import {LanguageService, UserService} from '../../../services/index';
import {Observable} from 'rxjs';
import {Tc} from '../../../utils';
import {AbstractAsyncValidator} from './abstract-async-validator';
// import {PublishService} from '../../../services/publisher/publish.service';
import {map} from 'rxjs/operators';

// MA with the help of: http://www.deanpdx.com/2018/02/04/angular-5-forms-dynamic-validation-summary.html
@Directive({
    standalone:true,
    selector: '[availableValidator][ngModel]',
    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: AvailableValidatorDirective, multi: true}],
    inputs: ['activated', 'resource', 'countryCode']
})

export class AvailableValidatorDirective extends AbstractAsyncValidator implements AsyncValidator, AfterViewInit, OnChanges {

    resource: AvailableResourceType;
    countryCode:string;

    constructor(public el: ElementRef,
                private userService: UserService,
                // private publishService: PublishService,
                private languageService: LanguageService) {
        super(el);
    }

    public isValid(value: string): Observable<boolean> {

        switch(this.resource){
            case AvailableResourceType.USERNAME:
                return this.userService.isUsernameTaken(value);
            case AvailableResourceType.MOBILE:
                return this.userService.isMobileTaken(this.countryCode + value);
            case AvailableResourceType.MOBILE_EXIST:
                return this.userService.isMobileTaken(this.countryCode + value).pipe(map(mobileTaken => !mobileTaken));//invalid if mobile is not taken
            case AvailableResourceType.EMAIL:
                return this.userService.isEmailTaken(value);
            // case AvailableResourceType.PUBLISH_NICKNAME:
            //     return this.publishService.isNickNameTaken(value);
        }

        Tc.assert(false, "should not be here")

        return null;

    }


    protected getErrorClassName():string{
        return 'available-validator';
    }

    protected getErrorMessage():string{
        switch(this.resource){
            case AvailableResourceType.USERNAME:
                return ValidationMessage.getMessage(ValidationMessageType.UsernameNotExistError, this.languageService);
            case AvailableResourceType.USERNAME_EXIST:
                return ValidationMessage.getMessage(ValidationMessageType.UsernameExistError, this.languageService);
            case AvailableResourceType.MOBILE:
                return ValidationMessage.getMessage(ValidationMessageType.MobileNotExistError, this.languageService);
            case AvailableResourceType.MOBILE_EXIST:
                return ValidationMessage.getMessage(ValidationMessageType.MobileExistError, this.languageService);
            case AvailableResourceType.EMAIL:
                return ValidationMessage.getMessage(ValidationMessageType.EmailNotExistError, this.languageService);
            case AvailableResourceType.EMAIL_EXIST:
                return ValidationMessage.getMessage(ValidationMessageType.EmailExistError, this.languageService);
            case AvailableResourceType.PUBLISH_NICKNAME:
                return ValidationMessage.getMessage(ValidationMessageType.PublishNickNameAvailable, this.languageService);
        }

        Tc.assert(false, "should not be here")

        return null;
    }

}

export enum AvailableResourceType {
    USERNAME = 0,
    USERNAME_EXIST = 1,
    EMAIL = 2,
    EMAIL_EXIST = 3,
    MOBILE = 4,
    MOBILE_EXIST = 5,
    PUBLISH_NICKNAME = 6
}

