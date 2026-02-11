import {Tc} from "../../../../utils/index";
import {CompositeEntry, CompositeEntryType} from './composite-condition';

export class LogicOperator implements CompositeEntry {

    entryType:CompositeEntryType;
    
    constructor(public type:LogicOperatorType) {
        this.entryType = CompositeEntryType.LogicOperator;
    }
    
    run(leftValue:boolean, rightValue:boolean) {
        switch(this.type){
        case LogicOperatorType.And:
            return leftValue && rightValue;
        case LogicOperatorType.Or:
            return leftValue || rightValue;
        }
        Tc.error("unknown type " + this.type);
        return false;        
    }

    shortCircuit(leftValue:boolean):boolean {        
        return ((this.type == LogicOperatorType.And) && !leftValue) ||
            ((this.type == LogicOperatorType.Or) && leftValue);        
    }
    
    toString():string {
        switch(this.type){
        case LogicOperatorType.And:
            return 'و';
        case LogicOperatorType.Or:
            return 'أو';
        }
        Tc.error("unknown type " + this.type);
        return null;        
    }
    
}

export enum LogicOperatorType {
    And = 1,
    Or
}

