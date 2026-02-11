import {Directive, ElementRef} from '@angular/core';
import {AbstractControl} from '@angular/forms';

/* NK
*  when we need to add new validator we should extend this class and override getErrorClassName method,
*  also we need to call initParentFormGroup on the ngAfterViewInit method and initControl on validate method.
*
*  Guide lines:
*  1. Add the validation field (input field) inside div with form-group class.
*  2. The validation field should has ngModel attribute alone or assigned to any model value.
* */
@Directive()
export abstract class AbstractValidator{

    activated:boolean = true;//input

     control:AbstractControl;

     parentFormGroup:JQuery;

    constructor(public el:ElementRef){}

    ngAfterViewInit(){
        this.initParentFromGroup();
    }

    ngOnChanges(){
        this.updateValidation();
    }


    protected initParentFromGroup(){
        this.parentFormGroup = $(this.el.nativeElement).parents('.form-group').first();
    }

    protected initControl(control:AbstractControl){
        if(!this.control){
            this.control = control;
        }
    }

    protected updateValidation(){
        if(this.control){
            this.control.updateValueAndValidity();
        }
    }

    protected hasValue():boolean {
        if(this.control.value){
            return true;
        }

        return false;
    }

    protected isTouched():boolean{
        if(!this.control.touched){
            //NK if the control never got touched we should not run any type of validation
            // and if there was any error validation message we should clean it
            this.removeErrorIfExisted();
            return false;
        }

        return true;
    }

    protected validIfNull():boolean {
        return true;
    }

    /* abstract members*/

    protected abstract getErrorClassName():string;

    /* Error */

    protected removeErrorIfExisted(){
        if(0 < this.parentFormGroup.find(`.${this.getErrorClassName()}`).length){
            this.parentFormGroup.find(`.${this.getErrorClassName()}`).remove();

            if(this.parentFormGroup.find('.tickerchart-validation-error-message').length == 0) {
                //NK if there is no error messages left, remove the has-error class
                this.parentFormGroup.removeClass('has-error');
            }
        }
    }

    protected showError(){
        if(this.parentFormGroup.find(`.${this.getErrorClassName()}`).length == 0){
            $(this.el.nativeElement).after(`<div class="alert alert-danger tickerchart-validation-error-message ${this.getErrorClassName()}">${this.getErrorMessage()}</div>`);
            this.parentFormGroup.addClass('has-error');
        }
    }

    protected removeAllErrorsIfExisted(){
        if(this.parentFormGroup.hasClass('has-error')){
            this.parentFormGroup.removeClass('has-error');
            this.parentFormGroup.find('.tickerchart-validation-error-message').remove();
        }
    }

    protected abstract getErrorMessage():string;

}
