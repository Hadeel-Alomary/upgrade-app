import {CompareOperator} from './compare-operator';
import {SimpleConditionOperand} from './simple-condition-operand';
import {Condition, ConditionType} from './condition';
import {CompositeEntryType} from './composite-condition';
import {Quote} from "../../../data/quote/index";

export class SimpleCondition implements Condition {    

    type:ConditionType;
    entryType:CompositeEntryType;    
    
    constructor(public operand1:SimpleConditionOperand,
                public operand2:SimpleConditionOperand,
                public operator:CompareOperator){
        this.type = ConditionType.Simple;
        this.entryType = CompositeEntryType.Condition;
    }
    
    run(quote:Quote):boolean {
        let value1:number = this.operand1.getValue(quote);
        let value2:number = this.operand2.getValue(quote);
        return this.operator.compare(value1, value2);
    }

    toString() {
        //NK i added | so we can split the returned text and translate every part alone.
        return this.operand1.toString() + '|' +
            this.operator.toDescription() + '|' +
            this.operand2.toString();        
    }
    
}



