//NK https://stackoverflow.com/questions/33866824/angular2-control-validation-on-blur

import {Directive} from '@angular/core';
import {AsyncValidatorFn, NgControl, ValidatorFn} from '@angular/forms';
import {filter} from "rxjs/operators";

@Directive({
    selector: '[validateOnBlur]',
    host: {
        '(focus)': 'onFocus()',
        '(blur)' : 'onBlur()'
    },
  standalone:true
})

export class ValidateOnBlurDirective {

     validators: ValidatorFn;
     asyncValidators: AsyncValidatorFn;
     hasFocus = false;
     countFocus: number = 0;

    constructor( public formControl: NgControl) {}

    onFocus() {

        //Abu5, on iphone current scenario will lead to lose input tag validators
        /*
        1- Select username input tag => focus event is fired
        2- From AutoFill select an already usernames => focus fired, blur also fired.
        3- on leaving the input, a blur event is fired
        ** events summary focus, focus, blur, blur
        ******** This event firing order will lead to lose the attached validators
        ******** Fix
            I saved validators and apply them each time on blur event
         */

        this.hasFocus = true;

        //NK save control validators on local variable
        if(this.formControl.control.validator || this.formControl.control.asyncValidator) {
            this.validators = this.formControl.control.validator;
            this.asyncValidators = this.formControl.control.asyncValidator;
        }

        //NK clear all validators to disable validation while user is contacting with the control
        this.formControl.control.clearAsyncValidators();
        this.formControl.control.clearValidators();

        //NK set the control in pending state to prevent make it valid once user touches it
        this.formControl.control.valueChanges.pipe(
            filter(() => this.hasFocus)
        ).subscribe(() => this.formControl.control.markAsPending());
    }

    onBlur() {

        this.hasFocus = false;

        //NK add all the validators back to the control from our local variable to start validate
        this.formControl.control.setAsyncValidators(this.asyncValidators);
        this.formControl.control.setValidators(this.validators);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA Without the if statement below, then whenever you step click in/out of a required field, you will
        // get a validation error. Even it makes sense, it is visually annoying.
        // Solution to that is to try to do validation "only if" there is a value entered. Otherwise, stay silent.
        // For required fields, that means not showing "required" error message when leaving the field with
        // no value provided. Delaying such messages to the "Submit" button, which will force an all-fields validation,
        // and show errors for all non-filled required fields.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (this.formControl.control.value || this.formControl.control.value === 0) { // run blur for number input with 0 value
            this.formControl.control.updateValueAndValidity();
        }
    }
}
