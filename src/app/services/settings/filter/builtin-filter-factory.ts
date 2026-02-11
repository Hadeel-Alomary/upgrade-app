import {Filter} from './filter';
import {
    SimpleCondition,
    SimpleConditionFieldOperand,
    SimpleConditionConstantOperand,
    CompareOperatorType,
    CompareOperator
} from './condition/index';


export class BuiltinFilterFactory {

    static create():Filter[] {

        let builtinFilters:Filter[] = [];

        builtinFilters.push(new Filter('بدون تصفية', 'no-filter', true, null));
        
        let builtinConfig = [{title: 'الشركات المتداولة', id:'traded-companies', field: 'trades', operator: CompareOperatorType.GreaterThan, constant: 0},
                             {title: 'الشركات الرابحة', id:'winning-companies', field: 'change', operator: CompareOperatorType.GreaterThan, constant: 0},
                             {title: 'الشركات الخاسرة', id:'losing-companies', field: 'change', operator: CompareOperatorType.LessThan, constant: 0},
                             {title: 'الشركات الثابتة', id:'fixed-companies',  field: 'change', operator: CompareOperatorType.Equal, constant: 0},
                             {title: 'شركات النسبة العليا', id:'limit-up-companies', field: 'limitUpReached', operator: CompareOperatorType.GreaterThan, constant: 0},
                             {title: 'شركات النسبة الدنيا', id:'limit-down-companies', field: 'limitDownReached', operator: CompareOperatorType.GreaterThan, constant: 0},
                             {title: 'شركات ذات الخسائر المتراكمة', id:'loosing-companies', field: 'flag', operator: CompareOperatorType.NotEqual, constant: 0},
                            ];
        
        builtinConfig.forEach(config => {
            let operand1:SimpleConditionFieldOperand = new SimpleConditionFieldOperand(config['field'], null);
            let operand2:SimpleConditionConstantOperand = new SimpleConditionConstantOperand(config['constant']);            
            let condition:SimpleCondition = new SimpleCondition(operand1, operand2, new CompareOperator(config['operator']));
            builtinFilters.push(new Filter(config['title'], config['id'], true, condition));
        });
        
        return builtinFilters;
        
    }
    
}
