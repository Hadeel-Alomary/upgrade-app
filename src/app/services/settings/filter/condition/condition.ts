import {CompositeEntry} from './composite-condition';
import {Quote} from "../../../data/quote/index";

export interface Condition extends CompositeEntry {        
    type: ConditionType;
    run(quote:Quote):boolean;        
}

export enum ConditionType {
    Composite = 1,
    Simple
}


