import {
    Component,
    Input,
    EventEmitter,
    Output,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';

import {FilterCondition} from "./filter-condition";
import {FilterConditionOperatorType, FilterConditionOperator} from "./filter-condition-operator";
import {NumberWithStepsComponent} from '../number-with-steps/number-with-steps.component';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

const filter = require("lodash/filter");

@Component({
    standalone:true,
    selector: 'filter-condition',
    templateUrl:'./filter-condition.component.html',
    styleUrls:['./filter-condition.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports:[NumberWithStepsComponent,NgForOf,FormsModule]
})

export class FilterConditionComponent  {

    @Input() decimalPlaces:number = 0;
    @Input() filter:FilterCondition;
    @Input() label:string;
    @Input() hasEqualOperator:boolean = true;
    @Output() filterChange:EventEmitter<FilterCondition> = new EventEmitter<FilterCondition>();

    constructor() {}

     get operators():FilterConditionOperator[] {
        // MA some screens, as in big trades, don't have equal operator. So, for them, don't show it
        let operators:FilterConditionOperator[] = FilterConditionOperator.getOperators();
        return this.hasEqualOperator ? operators : filter(operators, (operator: FilterConditionOperator) => operator.type !== FilterConditionOperatorType.Equal);
    }

     isFromToOperatorSelected():boolean {
        return this.filter.operator.type == FilterConditionOperatorType.FromValueToValue;
    }

     setOperator(operatorValue:string):void {
        this.filter.operator = FilterConditionOperator.getOperatorByType(+operatorValue);
        this.fireChange();
    }

     fireChange() {
        this.filterChange.emit(this.filter);
    }

}


