import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS} from '../../../ng2-bootstrap/ng2-bootstrap';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AppBrowserUtils, MathUtils} from '../../../utils/index';
// import {MathUtils} from 'tc-web-chart-lib';
import {MarketTick} from '../../../services/data/markets-tick-size/market-tick';
import {NumberWithStepsComponent} from '..';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
    standalone:true,
    selector: 'price-input',
    templateUrl: './price-input.component.html',
    styleUrls: ['./price-input.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    viewProviders: [BS_VIEW_PROVIDERS],
    imports:[NumberWithStepsComponent,NgIf],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PriceInputComponent),
            multi: true
        }
    ],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                'height': '*',
            })),
            state('out', style({
                'height': '0',
                'border': '0'
            })),
            transition('in <=> out', animate('500ms linear'))
        ])
    ]
})

export class PriceInputComponent implements ControlValueAccessor {
    @Input() priceStep: number;
    @Input() price: string;
    @Input() listOfPrices: string[];
    @Input() marketTickSizes: MarketTick[];
    @Input() disabled: boolean = false;

    @Output() onPriceChanged = new EventEmitter<string>();

    @ViewChild('dropDownListView') dropDownListElement: ElementRef;

    dropDownMenuCollapse: boolean = false;

    @ViewChild(NumberWithStepsComponent) numberWithStepsComponent: NumberWithStepsComponent;

    onChange = (numValue: string) => {};
    onTouched = () => {};

    constructor(public el: ElementRef, public cd: ChangeDetectorRef) {
    }

    public setPrice(price: number) {
        this.price = price.toString();
    }

    getRoundedPrice(): number {
        return MathUtils.roundToNearestStep(+this.price, this.priceStep);
    }

    onPriceChange(decrease : boolean) {
        this.priceStep = this.getCorrectTickSizeIfInputValueEqualTickStartPrice(decrease);
        this.numberWithStepsComponent.step = this.priceStep;
        this.numberWithStepsComponent.decimalPlaces = this.getDecimalPlaces();
    }

    public emitValueChange() {
        this.onPriceChanged.emit(this.getRoundedPrice().toString());
    }

    public toggleDropDownMenu() {
        this.scrollToSpecificDiv();
        this.dropDownMenuCollapse = !this.dropDownMenuCollapse;
    }

    public dropDownMenuSlidingState() {
        return this.dropDownMenuCollapse ? 'in' : 'out';
    }

    public getDecimalPlaces() : number {
        if(this.priceStep) {
            let tickSizeStr = this.priceStep.toString();
            let decimalPlaces = tickSizeStr.includes('.') ? tickSizeStr.split('.')[1].length : 0;

            if(decimalPlaces === 4)
                return 4;
        }
        return 2;
    }

    public getMinValue(): number {
        let decimalPlaces: number = this.getDecimalPlaces();
        if(decimalPlaces === 4) {
            return 0.0001;
        } else if(decimalPlaces === 3) {
            return 0.001;
        } else if(decimalPlaces === 2) {
            return 0.01;
        } else if(decimalPlaces === 1) {
            return 0.1;
        }

        return 0.01; //default value decimal places is 2
    }

    private getCorrectTickSizeIfInputValueEqualTickStartPrice(decrease:boolean): number {
        if (this.marketTickSizes) {
            let ticks = this.marketTickSizes;
            for (let i = 1; i < ticks.length; i++) {
                if (this.getRoundedPrice() === ticks[i].startPrice) {
                    return decrease ? ticks[i - 1].tickSize : ticks[i].tickSize;
                }
            }
            return this.priceStep;
        }
    }

    public onSelectPriceChange(price: string) {
        this.closeDropDownList();
        this.price = price;
        this.emitValueChange();
    }

    isValueSelected(value: string) {
        // MA if tradingValue falls out of listOfValue range (which is computed usually from Quote range) that is shown in the select,
        // then pick the first/last one that is closed to tradingValue.
        let selectedPrice = this.getRoundedPrice().toFixed(2);
        if (+selectedPrice > +this.listOfPrices[0]) {
            selectedPrice = this.listOfPrices[0];
        }
        if (+selectedPrice < +this.listOfPrices[this.listOfPrices.length - 1]) {
            selectedPrice = this.listOfPrices[this.listOfPrices.length - 1];
        }
        return value === selectedPrice;
    }

    private scrollToSpecificDiv() {
        let elementIndex = this.listOfPrices.findIndex(price => price == parseFloat(this.price).toFixed(2));
        if (elementIndex > -1) {//found
            let above2ElementsIndex = (elementIndex - 2) < 0 ? 0 : elementIndex -2;//needed to put the selected price in the middle
            let focusedElement = this.dropDownListElement.nativeElement.getElementsByClassName(this.valueToClassName(this.listOfPrices[above2ElementsIndex])).item(0);
            focusedElement.scrollIntoView();
        } else if(+this.price > +this.listOfPrices[0]) {
            let firstListOptionsClassName =this.valueToClassName(this.listOfPrices[0].toString());
            let firstListOptionsElement = this.dropDownListElement.nativeElement.getElementsByClassName(firstListOptionsClassName).item(0);
            firstListOptionsElement.scrollIntoView();
        } else {
            let lastListOptionsClassName =this.valueToClassName(this.listOfPrices[this.listOfPrices.length - 1].toString());
            let lastListOptionsElement = this.dropDownListElement.nativeElement.getElementsByClassName(lastListOptionsClassName).item(0);
            lastListOptionsElement.scrollIntoView();
        }
    }

    valueToClassName(value:string) {
        return 'value-' + value.replace('.', '-');
    }

    private closeDropDownList() {
        this.dropDownMenuCollapse = false;
    }

    isDesktop() {
        return AppBrowserUtils.isDesktop();
    }

    @HostListener('document:click', ['$event'])
     onDocumentClick(event: Event) {
        if (this.dropDownListElement && this.dropDownListElement.nativeElement !== null) {
            let isDropDownArrowClicked: boolean = $(event.target).hasClass('drop-down-arrow-container')
                || $(event.target).parents().hasClass('drop-down-arrow-container');
            if (!this.dropDownListElement.nativeElement.contains(event.target as HTMLElement) && !isDropDownArrowClicked) {
                this.closeDropDownList();
            }
        }
    }

    registerOnChange(func: (numValue: string) => {}): void {
        this.onChange = func;
    }

    registerOnTouched(func: () => {}): void {
        this.onTouched = func;
    }

    writeValue(value: string): void {
        if (value) {
            this.onPriceChanged.emit(value);
        }
    }
}
