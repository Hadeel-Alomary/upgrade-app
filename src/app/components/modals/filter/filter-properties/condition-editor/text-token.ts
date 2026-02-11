import {
    Condition,
    ConditionType,
    SimpleCondition,
    CompositeCondition,
    CompositeEntry,
    CompositeEntryType,
    LogicOperator
} from '../../../../../services/settings/filter/condition/index';

import {StringUtils} from '../../../../../utils/index';

export class TextToken {

    static BEGIN_PARANTHESIS:string = '(';
    static END_PARANTHESIS:string = ')';
    
    guid:string;
    
    constructor(public text:string,
                public object: CompositeEntry = null) {
        this.guid = StringUtils.guid();
    }

    /* condition -> textToken*/
    
    static fromCondition(condition:Condition):TextToken[] {
        let result:TextToken[] = [];
        if(!condition) {
            return result;
        }
        TextToken.conditionToText(condition, result, true);
        return result;        
    }
    
     static conditionToText(condition:Condition, tokens:TextToken[], topLevel:boolean = false):TextToken[] {
        
        if(condition.type == ConditionType.Simple) {
            let simpleCondition:SimpleCondition = <SimpleCondition> condition;
            tokens.push(new TextToken(simpleCondition.toString(), simpleCondition));
            return;
        }

        tokens.push(new TextToken(TextToken.BEGIN_PARANTHESIS));
        (<CompositeCondition>condition).entries.forEach( (entry, index) => {
            if(index % 2) {
                let logicOperator = <LogicOperator> entry;
                tokens.push(new TextToken(logicOperator.toString(), logicOperator));
            } else {
                TextToken.conditionToText(<Condition>entry, tokens);
            }
        });
        tokens.push(new TextToken(TextToken.END_PARANTHESIS));

        // remove extra paranthesis that surrounds topLevel
        if(topLevel) {
            tokens.shift();
            tokens.pop();
        }
        
    }

    /* textToken -> condition */
    
    static toCondition(tokens:TextToken[]):Condition {
        tokens = tokens.slice(0); // clone tokens
        return TextToken.textToCondition(tokens, true);                
    }
    
     static textToCondition(tokens:TextToken[], topLevel:boolean = false):Condition {
        
        let entries:CompositeEntry[] = [];
        
        while(tokens.length){            
            
            let token = tokens.shift();

            if(token.text == TextToken.BEGIN_PARANTHESIS){
                let condition:Condition = TextToken.textToCondition(tokens);
                if( !condition || !tokens.length ){ // fail if no condition or no "end"f or "begin"
                    return null;
                }
                entries.push(condition);
                tokens.shift(); // remove end for begin
            } else if(token.text == TextToken.END_PARANTHESIS){
                tokens.unshift(token); // return "end" (should be removed by caller)
                break;
            } else  {                
                entries.push(token.object);                
            }
            
        }

        // fail if we still have tokens after finishing process top level
        if(topLevel && tokens.length){ 
            return null;
        }

        // fail if not valid entris for composite condition
        if(!TextToken.validateCompositeEntries(entries)) {
            return null;
        }
        
        return <Condition> (1 == entries.length ? entries[0] : new CompositeCondition(entries));
                
    }
    
     static validateCompositeEntries(entries: CompositeEntry[]) {
        
        if(entries.length % 2 == 0) { // MA must have odd entries
            return false;
        }
        
        let valid:boolean = true;        

        entries.forEach( (entry, index) => {
            if(index % 2) {
                valid = valid && (entry.entryType == CompositeEntryType.LogicOperator);
            } else {
                valid = valid && (entry.entryType == CompositeEntryType.Condition);
            }
        });
        
        return valid;
        
    }
        
}
