import {Condition} from './condition/index';
import {Quote} from "../../data/quote/index";

export class Filter {
    
    constructor(public name:string,
                public id:string,
                public builtin:boolean,
                public condition:Condition){
    }
    
    run(quote:Quote):boolean {
        if(!this.condition) { return true; }
        return this.condition.run(quote);
    }
    
}












