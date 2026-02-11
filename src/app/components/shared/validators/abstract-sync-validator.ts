import {ElementRef} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {AbstractValidator} from './abstract-validator';


export abstract class AbstractSyncValidator extends AbstractValidator{

    constructor(public el:ElementRef){
        super(el);
    }

    validate(control: AbstractControl): {[key: string]: {value: null}} {
        this.initControl(control);

        if (!this.isTouched() && !this.hasValue()) {
            return null;
        }

        if (!this.activated) {
            this.removeErrorIfExisted();
            return null;
        }

        if(!(control.value || control.value === 0) && this.validIfNull()) {
            return null;
        }

        if (!this.isValid(control.value)) {
            this.removeAllErrorsIfExisted();
            this.showError();
            return {'error': {value: null}};
        }

        this.removeErrorIfExisted();

        return null;

    }

    protected abstract isValid(value:unknown):boolean;

}
