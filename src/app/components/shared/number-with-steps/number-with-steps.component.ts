import {Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, ViewChild, ElementRef, forwardRef, HostListener} from '@angular/core';
import {BS_VIEW_PROVIDERS} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppBrowserUtils} from '../../../utils';
import {AppMathUtils} from '../../../utils/app.math.utils';

@Component({
  standalone:true,
    selector: 'number-with-steps',
    templateUrl: './number-with-steps.component.html',
    styleUrls: ['./number-with-steps.component.css'],
    encapsulation: ViewEncapsulation.None,
    viewProviders: [BS_VIEW_PROVIDERS],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberWithStepsComponent),
            multi: true
        }
    ]
})
export class NumberWithStepsComponent implements ControlValueAccessor {

    @Input() isArrowSteps: boolean = true;
    @Input() numValue: number = 0;
    @Input() minValue: number = 0;
    @Input() maxValue: number = Number.MAX_SAFE_INTEGER;
    @Input() decimalPlaces: number = 0;
    @Input() step: number = 1;
    @Input() decreaseStep: number;
    @Input() disabled: boolean = false;
    @Input() placeHolder: string = '';
    @Input() placeHolderTransitionStatement: string = '';

    @Output() focus = new EventEmitter();
    @Output() blur = new EventEmitter();
    @Output() numValueChange = new EventEmitter<number>();
    @Output() onDecreaseValue = new EventEmitter();
    @Output() onIncreaseValue = new EventEmitter();

    @ViewChild('arrowSteps') arrowSteps: ElementRef;
    @ViewChild('plusMinusSteps') plusMinusSteps: ElementRef;
    @ViewChild('inputArrow') arrowNumberStep: ElementRef;
    @ViewChild('inputPlusMinus') plusMinusStep: ElementRef;

    lastInputValue: string;

    constructor(public cd: ChangeDetectorRef) { }

    onChange = (numValue: number) => {};
    onTouched = () => {};

    @HostListener('mousewheel')
    onMouseWheel() {
        this.getInputField().focus();
    }

    @HostListener('focusin', ['$event'])
    onFocusin(event: FocusEvent) {
        let parent = this.arrowSteps ? this.arrowSteps : this.plusMinusSteps;
        if (!this.isChild(parent, event.relatedTarget as HTMLElement)) {
            this.focus.emit(event);
            this.onTouched();
        }
    }

    @HostListener('focusout', ['$event'])
    onFocusout(event: FocusEvent) {
        let parent = this.arrowSteps ? this.arrowSteps : this.plusMinusSteps;
        if (!this.isChild(parent, event.relatedTarget as HTMLElement)) {
            this.blur.emit(event);
            this.onChange(this.numValue);
        }
    }

    public getInputField(){
        if(this.arrowNumberStep) {
            return this.arrowNumberStep.nativeElement;
        }
        if(this.plusMinusStep) {
            return this.plusMinusStep.nativeElement;
        }
    }

    private isChild(parent: ElementRef, child: HTMLElement): boolean {
        return parent.nativeElement.contains(child);
    }

    // onInputMouseWheel(event: MouseWheelEvent) {
    //     this.setNumValue(this.getInputField().value);
    //
    //     if (event.wheelDelta > 0) {
    //         this.increaseInputValue();
    //     } else {
    //         this.decreaseInputValue();
    //     }
    //
    //     event.preventDefault();
    // }

    public valueAsString(): string {
        let value: number = 0;
        if (this.numValue) {
            value = this.numValue;
        }else{
            value = this.minValue;
        }

        return value.toFixed(this.decimalPlaces);
    }

    public getLastInputValue() {
        //Ehab: Get last input value before rounding to a step
        //Sometimes user entered a custom price, we need to check if this price withing allowed nearest step if not --> we will warn client about price is not comply with price step.

        return this.lastInputValue;
    }

    private updateValue(value: number) {
        this.lastInputValue = value.toString();

        if (value > this.maxValue) {
            value = this.maxValue;
        } else if (value < this.minValue) {
            value = this.minValue;
        }

        // Abu5, need to round user entered value to nearest decimal digit
        value = +value.toFixed(this.decimalPlaces);

        this.numValue = value;
        this.getInputField().value = this.valueAsString();
        this.onChange(this.numValue);
        this.numValueChange.emit(this.numValue);
    }

    public fireUserInput(userInput: number) {
        this.onChange(userInput);
    }

    public setNumValue(value: string) {
        this.updateValue(+value);
    }

    private getInputValue() : string {
        let value : string = this.getInputField().value;
        if (value.includes(',')) {
            // Replace the comma with an empty string
            value = value.replace(/,/g, '');
        }
        return value;
    }

    public increaseInputValue() {
        this.onIncreaseValue.emit();

        let newValue: number = AppMathUtils.roundToNearestStep(+this.getInputValue(), this.step);
        newValue += this.step;
        this.updateValue(newValue);
    }

    public decreaseInputValue() {
        this.onDecreaseValue.emit();

        let step = this.decreaseStep ? this.decreaseStep : this.step;
        let newValue: number = AppMathUtils.roundToNearestStep(+this.getInputValue(), step);
        newValue -= step;
        this.updateValue(newValue);
    }

    public isInputFieldClicked(): boolean {
        return document.activeElement == this.getInputField();
    }

    public mustBeNumber(event: KeyboardEvent): boolean {
        // MA ensure that key press will end up with numeric value
        // When we return false, the keypress will be ignored
        let newNumber: string = this.getInputValue() + event.key;
        return !isNaN(+newNumber);
    }

    public shadingInputValueInMobile() {
        if (!AppBrowserUtils.isDesktop()) {
            this.getInputField().select();
        }
    }

    registerOnChange(func: (numValue: number) => {}): void {
        this.onChange = func;
    }

    registerOnTouched(func: () => {}): void {
        this.onTouched = func;
    }

    writeValue(value: number): void {
        if (value) {
            this.setNumValue(value.toString());
        } else if (value === 0 && this.minValue <=0) {
            this.setNumValue(value.toString());
        }
    }

}
