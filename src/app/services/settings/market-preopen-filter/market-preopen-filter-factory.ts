import {
    Filter,
    SimpleCondition,
    SimpleConditionFieldOperand,
    SimpleConditionConstantOperand,
    CompareOperatorType,
    CompareOperator
} from '../../settings/filter/index';


export class MarketPreOpenFilterFactory {

    static create():Filter[] {

        let filters:Filter[] = [];

        filters.push(new Filter('بدون تصفية', 'pre-open-no-filter', true, null));

        let filtersConfig = [
            {title: 'الشركات الرابحة', id:'pre-open-winning-companies', field: 'preOpenChange', operator: CompareOperatorType.GreaterThan,   constant: 0},
            {title: 'الشركات الخاسرة', id:'pre-open-losing-companies',  field: 'preOpenChange', operator: CompareOperatorType.LessThan,      constant: 0},
            {title: 'الشركات الثابتة', id:'pre-open-fixed-companies',   field: 'preOpenChange', operator: CompareOperatorType.Equal,         constant: 0},
        ];

        filtersConfig.forEach(config => {
            let operand1:SimpleConditionFieldOperand = new SimpleConditionFieldOperand(config['field'], null);
            let operand2:SimpleConditionConstantOperand = new SimpleConditionConstantOperand(config['constant']);
            let condition:SimpleCondition = new SimpleCondition(operand1, operand2, new CompareOperator(config['operator']));
            filters.push(new Filter(config['title'], config['id'], true, condition));
        });

        return filters;
    }
}
