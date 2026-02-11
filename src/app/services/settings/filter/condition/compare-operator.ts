import {Tc} from "../../../../utils/index";

export class CompareOperator {

    constructor(public type:CompareOperatorType){}
    
    compare(leftValue:number, rightValue:number) {
        switch(this.type){
        case CompareOperatorType.GreaterThan:
            return leftValue > rightValue;
        case CompareOperatorType.GreaterThanOrEqual:
            return leftValue >= rightValue;
        case CompareOperatorType.LessThan:
            return leftValue < rightValue;
        case CompareOperatorType.LessThanOrEqual:
            return leftValue <= rightValue;
        case CompareOperatorType.Equal:
            return leftValue == rightValue;
        case CompareOperatorType.NotEqual:
            return leftValue != rightValue;
        }
        Tc.error("unknown type " + this.type);
        return false;        
    }

    toSymbol():string {
        switch(this.type){
        case CompareOperatorType.GreaterThan:
            return '>';
        case CompareOperatorType.GreaterThanOrEqual:
            return '>=';
        case CompareOperatorType.LessThan:
            return '<';
        case CompareOperatorType.LessThanOrEqual:
            return '<=';
        case CompareOperatorType.Equal:
            return '=';
        case CompareOperatorType.NotEqual:
            return '!=';
        }
        Tc.error("unknown operator type " + this.type);
        return null;
    }

    toDescription():string {
        switch(this.type){
        case CompareOperatorType.GreaterThan:
            return 'أكبر من';
        case CompareOperatorType.GreaterThanOrEqual:
            return 'أكبر من أو يساوي';
        case CompareOperatorType.LessThan:
            return 'أقل من';
        case CompareOperatorType.LessThanOrEqual:
            return 'أقل من أو يساوي';
        case CompareOperatorType.Equal:
            return 'يساوي';
        case CompareOperatorType.NotEqual:
            return 'لا يساوي';
        }
        Tc.error("unknown operator type " + this.type);
        return null;
    }
        
}

export enum CompareOperatorType {
    GreaterThan = 1,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Equal,
    NotEqual
}
