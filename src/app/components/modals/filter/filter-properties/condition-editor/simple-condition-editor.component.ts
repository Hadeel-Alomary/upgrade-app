import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnChanges,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import {
    SimpleCondition,
    SimpleConditionFieldOperand,
    SimpleConditionConstantOperand,
    CompareOperator,
    CompareOperatorType,
    SimpleConditionOperandType
} from '../../../../../services/settings/filter/condition/index';

import {Tc} from '../../../../../utils/index';

import {TextToken} from './text-token';

const cloneDeep = require("lodash/cloneDeep");

@Component({
    selector: 'simple-condition-editor',    
    templateUrl:'./simple-condition-editor.component.html',
    styleUrls:['./simple-condition-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class SimpleConditionEditorComponent implements OnChanges {
    
    @Input() inputToken:TextToken;
    @Input() editingMode:boolean;
    @Output() outputToken = new EventEmitter();

     condition:SimpleCondition;
     fields:{name:string, id:string}[];
     compareOperators:{name:string, type:CompareOperatorType}[] = [];
     operandTypes:{name:string, type:SimpleConditionOperandType}[] = [];
     operandType = SimpleConditionOperandType;
    
    constructor(){
        this.initFields();              
    }

    ngOnChanges() {
        this.condition = <SimpleCondition> cloneDeep(this.inputToken.object);
    }
    
    /* template helper */
     get buttonText():string {
        return this.editingMode ? 'تعديل الشرط' : 'اضافة الشرط';
    }
     get title():string {
        return this.editingMode ? 'تعديل شرط التصفية' : 'اضافة شرط جديد إلى التصفية';
    }

    get operand1Field():string{
         return (<SimpleConditionFieldOperand>this.condition.operand1).field;
    }

    get operand2Field():string{
        return (<SimpleConditionFieldOperand>this.condition.operand2).field;
    }

    /* interactive events */
     onChangeOperand2Type(value:SimpleConditionOperandType) {
        if(value == SimpleConditionOperandType.Field) {
            let fieldOperand:SimpleConditionFieldOperand = new SimpleConditionFieldOperand(this.fields[0]['id'], this.fields[0]['name']);
            this.condition.operand2 = fieldOperand;
        } else {
            let constantOperand:SimpleConditionConstantOperand = new SimpleConditionConstantOperand(0);
            this.condition.operand2 = constantOperand;
        }        
    }

     onChangeOperand1(id:string){
        let field = this.fields.find(field => field.id == id);
        (<SimpleConditionFieldOperand>this.condition.operand1).field = field['id'];
        (<SimpleConditionFieldOperand>this.condition.operand1).name = field['name'];        
    }

     onChangeOperand2(id:string){
        let field = this.fields.find(field => field.id == id);
        (<SimpleConditionFieldOperand>this.condition.operand2).field = field['id'];
        (<SimpleConditionFieldOperand>this.condition.operand2).name = field['name'];        
    }

     onChangeOperator(value:string){
        this.condition.operator.type = +value;
    }
    
     onSave() {
        this.inputToken.object = this.condition;
        this.inputToken.text = this.condition.toString();
        this.outputToken.emit(this.inputToken);
    }

     onCancel() {
        this.outputToken.emit(null);
    }
    
    /* init methods */
    
     initFields() {
        
        this.fields = [
            {name: 'إغلاق' , id: 'close'} ,
            {name: 'آخر' , id: 'last'} ,
            {name:'حجم آخر' , id: 'lastVolume'} ,            
            {name:'التغير' , id: 'change'} ,
            {name:'التغير %' , id: 'changePercent'} ,            
            {name: 'حجم الطلب' , id: 'bidVolume'} ,
            {name: 'الطلب' , id: 'bidPrice'} ,
            {name: 'العرض' , id: 'askPrice'} ,
            {name: 'حجم العرض' , id: 'askVolume'} ,            
            {name: 'الحجم' , id: 'volume'} ,
            {name: 'القيمة' , id: 'amount'} ,
            {name: 'الصفقات' , id: 'trades'} ,            
            {name: 'إفتتاح' , id: 'open'} ,
            {name: 'أعلى' , id: 'high'} ,
            {name: 'أدنى' , id: 'low'} ,
            {name: 'الاغلاق السابق' , id: 'previousClose'} ,
            {name: 'الافتتاح (المتوقع)' , id: 'preOpenPrice'} ,
            {name: 'حجم الافتتاح (المتوقع)' , id: 'preOpenVolume'} ,            
            {name: 'تدفق السيولة' , id: 'liquidityFlow'} ,
            {name: 'صافي السيولة' , id: 'liquidityNet'} ,
            {name: 'نسبة السيولة' , id: 'liquidityInflowPercent'} ,
            {name: 'إجمالي حجم الطلب' , id: 'totalBidVolume'} ,
            {name: 'إجمالي حجم العرض' , id: 'totalAskVolume'} ,            
            {name: 'الأعلى سنويا' , id: 'week52High'} ,
            {name: 'الأدنى سنويا' , id: 'week52Low'} ,
            {name: 'قيمة الحق الإرشادية' , id: 'fairPrice'} ,
            {name: 'السعر المعتمد في المؤشر' , id: 'priceInIndex'} ,
            {name: 'التغير المعتمد في المؤشر' , id: 'changeInIndex'} ,
            {name: 'الوزن في المؤشر' , id: 'weightInIndex'} ,
            {name: 'الوزن في القطاع' , id: 'weightInSector'} ,
            {name: 'التأثير على المؤشر (بالنقاط)' , id: 'effectOnIndex'} ,
            {name: 'التأثير على القطاع' , id: 'effectOnSector'}            
        ];

        Tc.enumValues(CompareOperatorType).forEach(compareOperatorType => {
            this.compareOperators.push({type: compareOperatorType,
                                        name: new CompareOperator(compareOperatorType).toDescription()});
        });

        Tc.enumValues(SimpleConditionOperandType).forEach(operandType => {
            this.operandTypes.push({type: operandType,
                                    name: this.getSimpleConditionOperandDescription(operandType)});
        });
        
    }

     getSimpleConditionOperandDescription(operandType:SimpleConditionOperandType) {
        switch(operandType){
        case SimpleConditionOperandType.Field:
            return 'حقل';
        case SimpleConditionOperandType.Constant:
            return 'قيمة';
        default:
            Tc.error("invalid operand type " + operandType);
        }
        return null;
    }

}


