import {LogicOperator} from './logic-operator';
import {Condition, ConditionType} from './condition';
import {Quote} from "../../../data/quote/index";

export class CompositeCondition implements Condition  {

    type:ConditionType;
    entryType:CompositeEntryType;
    
    constructor(public entries:CompositeEntry[]){
        this.type = ConditionType.Composite;
        this.entryType = CompositeEntryType.Condition;
    }
    
    run(quote:Quote):boolean {

        let index:number = 0;
                
        let result:boolean = (<Condition>this.entries[index++]).run(quote); // run first entry
        
        while(index < this.entries.length) { // loop on remaining entries, and run logical operator on them

            let operator:LogicOperator = <LogicOperator> this.entries[index++];
            
            if(operator.shortCircuit(result)) { // check whether to stop execution
                break;
            }
            
            result = operator.run(result, (<Condition> this.entries[index++]).run(quote));
            
        }
        
        return result;
        
    }
    
}

export interface CompositeEntry {
    entryType:CompositeEntryType;    
}

export enum CompositeEntryType {
    Condition = 1,
    LogicOperator    
}
