import {Tc} from "../../../utils/index";

export enum FilterConditionOperatorType {
    GreaterThan = 1,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Equal,
    FromValueToValue
}

export class FilterConditionOperator {

     static operators:FilterConditionOperator[] = [];
    
    constructor(public type:FilterConditionOperatorType, public name:string) { }

    static getOperatorByType(type:FilterConditionOperatorType):FilterConditionOperator {              
        let result:FilterConditionOperator = FilterConditionOperator.getOperators().find(operator => operator.type == type);
        Tc.assert(result != null, "fail to find operator");
        return result;
    }
    
    static getOperators():FilterConditionOperator[] {
        if(!FilterConditionOperator.operators.length) {            
            FilterConditionOperator.operators.push(new FilterConditionOperator(FilterConditionOperatorType.GreaterThan, 'أكبر من'));
            FilterConditionOperator.operators.push(new FilterConditionOperator(FilterConditionOperatorType.GreaterThanOrEqual, 'أكبر أو يساوي'));
            FilterConditionOperator.operators.push(new FilterConditionOperator(FilterConditionOperatorType.LessThan, 'أصغر من'));
            FilterConditionOperator.operators.push(new FilterConditionOperator(FilterConditionOperatorType.LessThanOrEqual, 'أصغر أو يساوي'));
            FilterConditionOperator.operators.push(new FilterConditionOperator(FilterConditionOperatorType.Equal, 'يساوي'));
            FilterConditionOperator.operators.push(new FilterConditionOperator(FilterConditionOperatorType.FromValueToValue, 'من قيمة إلى قيمة'));
        }
        return FilterConditionOperator.operators;        
    }
 
    
    
}
