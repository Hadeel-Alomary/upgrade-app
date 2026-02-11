import {FilterConditionOperatorType, FilterConditionOperator} from "./filter-condition-operator";
import {Tc} from "../../../utils/index";

export class FilterCondition {
    
    constructor(public value1:number,
                public value2:number,
                public operator:FilterConditionOperator){}

    static filter(filter:FilterCondition, value:number):boolean {
        
        switch (filter.operator.type){
        case FilterConditionOperatorType.GreaterThan:
            return value > filter.value1;
        case FilterConditionOperatorType.GreaterThanOrEqual:
            return value >= filter.value1;
        case FilterConditionOperatorType.LessThan:
            return value < filter.value1;
        case FilterConditionOperatorType.LessThanOrEqual:
            return value <= filter.value1;
        case FilterConditionOperatorType.FromValueToValue:
            return filter.value1 <= value  && value <= filter.value2 ;
        case FilterConditionOperatorType.Equal:
            return filter.value1 == value;
        }
        
        Tc.error("unknown operator " + filter.operator);
        
        return false;
    }

    static newFilter():FilterCondition {
        let operator:FilterConditionOperator =
            FilterConditionOperator.getOperatorByType(FilterConditionOperatorType.GreaterThan);        
        return new FilterCondition(0, 0, operator);
    }
    
}

