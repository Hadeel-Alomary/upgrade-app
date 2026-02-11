import {Quote} from "../../../data/quote/index";

export interface SimpleConditionOperand {
    
    type:SimpleConditionOperandType;

    getValue(quote:Quote):number;

    toString():string;
    
}

export class SimpleConditionFieldOperand implements SimpleConditionOperand {
   
    type:SimpleConditionOperandType;
    
    constructor(public field:string,
                public name:string) {
        this.type = SimpleConditionOperandType.Field;
    }
    
    getValue(quote:Quote):number {
        return quote[this.field] as number;
    }

    toString():string {
        return this.name;
    }
        
}

export class SimpleConditionConstantOperand implements SimpleConditionOperand {
    
    type:SimpleConditionOperandType;
    
    constructor(public value:number) {
        this.type = SimpleConditionOperandType.Constant;
    }
    
    getValue(quote:Quote):number {
        return this.value;
    }

    toString():string {
        return this.value + '';
    }
            
}

export enum SimpleConditionOperandType {
    Field = 1,
    Constant
}
