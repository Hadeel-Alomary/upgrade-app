import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnChanges,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import{
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/animations';

import {
    CompareOperator,
    CompareOperatorType,
    SimpleCondition,
    SimpleConditionFieldOperand,
    SimpleConditionConstantOperand,
    Condition,
    LogicOperator,
    CompositeEntryType,
    LogicOperatorType
} from '../../../../../services/settings/filter/condition/index';

import {
    LanguageService
} from '../../../../../services/index';

import {
    StringUtils
} from '../../../../../utils/index';

import {TextToken} from './text-token';

@Component({
    selector: 'composite-condition-editor',    
    templateUrl:'./composite-condition-editor.component.html',
    styleUrls:['./composite-condition-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('showCondition', [
            state('expanded', style({
                height: '355px'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ]),
        trigger('showEditor', [
            state('expanded', style({
                height: '355px'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ])
    ],
})

export class CompositeConditionEditorComponent implements OnChanges {

    @Input() condition:Condition;
    @Output() outputCondition = new EventEmitter();

     logicOperatorType = LogicOperatorType;
     tokens:TextToken[] = [];
     editingToken:TextToken;

     valid:boolean = false;
    
     constructor(public languageService:LanguageService){}

    ngOnChanges() {
        if(this.condition) {
            this.tokens = TextToken.fromCondition(this.condition);
        } else {
            this.tokens = [];
        }
        this.valid = true; // consider null input condition as valid
    }

    /* template helper */

     isCondition(token:TextToken){
        return token.object != null && (token.object.entryType == CompositeEntryType.Condition);
    }

     isOperator(token:TextToken){
        return token.object != null && (token.object.entryType == CompositeEntryType.LogicOperator);
    }

     isEditing():boolean {
        return this.tokens.find(token => token.guid == this.editingToken.guid) != null;
    }

    getTokenText(text:string):string{
         let tokenParts:string[] = text.split("|");
         if(this.languageService.arabic) {
             return tokenParts.join(" ");
         }

         let tokenText:string = "" ;
         for(let part of tokenParts) {
             if (StringUtils.isNumber(part)) {
                 tokenText += part + " ";
             } else {
                 tokenText += this.languageService.translate(part) + " ";
             }
         }
         return tokenText;
    }

    /* interactive events */

     onAddBeginParanthesis() {
        this.addToken(new TextToken(TextToken.BEGIN_PARANTHESIS));
    }
    
     onAddEndParanthesis() {
        this.addToken(new TextToken(TextToken.END_PARANTHESIS));
    }

     onAddLogicOperator(logicOperatorType:LogicOperatorType) {
        let operator:LogicOperator = new LogicOperator(logicOperatorType);        
        this.addToken(new TextToken(operator.toString(), operator));
    }

     onNewSimpleCondition() {
        let operand1:SimpleConditionFieldOperand = new SimpleConditionFieldOperand('close', 'إغلاق');
        let operand2:SimpleConditionConstantOperand = new SimpleConditionConstantOperand(0);
        let condition:SimpleCondition = new SimpleCondition(operand1, operand2, new CompareOperator(CompareOperatorType.GreaterThan));        
        this.editingToken = new TextToken(condition.toString(), condition);        
    }

     onDoneUpdatingToken(token:TextToken){
        if(token && !this.tokens.includes(token)) {            
            this.tokens.push(token);
        }
        this.editingToken = null;
        this.validate();
    }
    
     onUpdateToken(index:number){
        this.editingToken = this.tokens[index];
    }
    
     onDeleteToken(index:number){
        this.tokens.splice(index, 1);
        this.validate();        
    }

    /* animations */
    
     get showCondition():string {
        return this.editingToken ? 'expanded' : 'collapsed';
    }
    
     get showEditor():string {
        return !this.editingToken ? 'expanded' : 'collapsed';
    }
    

    /* misc */
    
     addToken(token:TextToken) {
        this.tokens.push(token);
        this.validate();
    }

     validate() {
        let condition = TextToken.toCondition(this.tokens);
        this.valid = condition != null;
        if(this.valid) {
            this.outputCondition.emit(condition);
        }
    }
    
}


