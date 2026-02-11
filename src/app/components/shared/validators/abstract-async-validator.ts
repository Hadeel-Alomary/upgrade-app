import {ElementRef} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {AbstractValidator} from './abstract-validator';
import {ValidationErrors} from '@angular/forms/src/directives/validators';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';


export abstract class AbstractAsyncValidator extends AbstractValidator{

    constructor(public el:ElementRef){
        super(el);
    }

    private lastValidValue:string;

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

        this.initControl(control);

        if (!this.isTouched() && !this.hasValue()) {
            return new Promise<ValidationErrors>(resolve => resolve(null));
        }

        if (!this.activated) {
            this.removeErrorIfExisted();
            return new Promise<ValidationErrors>(resolve => resolve(null));
        }

        let value: string = control.value;

        // MA if the value hasn't changed from the lastValid one, then no need to redo async validation.
        if(value == this.lastValidValue) {
            this.removeErrorIfExisted();
            return new Promise<ValidationErrors>(resolve => resolve(null));
        }

        return this.isValid(value).pipe(map(
            result => {
                this.removeAllErrorsIfExisted();
                if (result) {
                    this.showError();
                    return {'availableValidation': null};
                } else {
                    this.lastValidValue = value;
                    return null;
                }
            })
        );

    }

    protected abstract isValid(value: string): Observable<boolean>;
}
