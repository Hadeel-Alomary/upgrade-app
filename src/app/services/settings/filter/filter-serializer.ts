import {Filter} from './filter';
import {
    Condition,
    ConditionType,
    CompositeCondition,
    LogicOperator,
    LogicOperatorType,
    SimpleCondition,
    SimpleConditionOperand,
    SimpleConditionFieldOperand,
    SimpleConditionConstantOperand,
    CompareOperator,
    CompareOperatorType,
    SimpleConditionOperandType,
    CompositeEntryType
} from './condition/index';
import {Tc} from '../../../utils/index';

import extend from 'lodash/extend';
// const extend = require("lodash/extend");

export class FilterSerializer {

    static fromJson(jsonString:string):Filter {
        let filter:Filter = new Filter(null, null, true, null); // any params
        extend(filter, JSON.parse(jsonString));
        filter.condition = FilterSerializer.extendCondition(filter.condition);
        return filter;
    }

    static toJson(filter:Filter):string {
        return JSON.stringify(filter);
    }

    private static extendCondition(condition:Condition):Condition {
        if(condition == null) {
            return;
        }
        if(condition.type == ConditionType.Simple){
            return FilterSerializer.extendSimpleCondition(condition);
        } else {
            return FilterSerializer.extendCompositeCondition(condition);
        }
    }

    private static extendSimpleCondition(conditionData:Condition):SimpleCondition {
        let condition:SimpleCondition = new SimpleCondition(null, null, null);
        extend(condition, conditionData);
        condition.operator = FilterSerializer.extendCompareOperator(condition.operator);
        condition.operand1 = FilterSerializer.extendSimpleConditionOperand(condition.operand1);
        condition.operand2 = FilterSerializer.extendSimpleConditionOperand(condition.operand2);
        return condition;
    }

    private static extendCompositeCondition(conditionData:Condition):CompositeCondition {
        let condition:CompositeCondition = new CompositeCondition(null);
        extend(condition, conditionData);
        condition.entries.forEach( (entry, index) => {
            if(entry.entryType == CompositeEntryType.Condition){
                condition.entries[index] = FilterSerializer.extendCondition(<Condition>entry);
            } else if(entry.entryType == CompositeEntryType.LogicOperator) {
                condition.entries[index] = FilterSerializer.extendLogicOperator(<LogicOperator>entry);
            }
        });
        return condition;
    }

    private static extendCompareOperator(operatorData:CompareOperator):CompareOperator {
        let operator:CompareOperator = new CompareOperator(CompareOperatorType.GreaterThan);
        extend(operator, operatorData);
        return operator;
    }

    private static extendLogicOperator(operatorData:LogicOperator):LogicOperator{
        let operator:LogicOperator = new LogicOperator(LogicOperatorType.Or);
        extend(operator, operatorData);
        return operator;
    }

    private static extendSimpleConditionOperand(operandData:SimpleConditionOperand):SimpleConditionOperand {
        let operand:SimpleConditionOperand;
        switch(operandData.type) {
        case SimpleConditionOperandType.Field:
            operand = new SimpleConditionFieldOperand(null, null);
            extend(operand, operandData);
            break;
        case SimpleConditionOperandType.Constant:
            operand = new SimpleConditionConstantOperand(null);
            extend(operand, operandData);
            break;
        default:
            Tc.error("invalid operant type " + operandData.type);
        }
        return operand;
    }

}
