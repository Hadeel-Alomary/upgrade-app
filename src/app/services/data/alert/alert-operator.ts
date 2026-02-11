export class AlertOperator{

    constructor(public id:string, public name:string, public operationSymbol:string){}

    private static operators:AlertOperator[] = [];
    public static getOperators():AlertOperator[]{
        if(AlertOperator.operators.length <= 0){
            AlertOperator.operators.push(new AlertOperator('GT','أكبر من', '>'));
            AlertOperator.operators.push(new AlertOperator('LT','أقل من', '<'));
            AlertOperator.operators.push(new AlertOperator('EQ','يساوي', '='));
            AlertOperator.operators.push(new AlertOperator('GE','أكبر أو يساوي', '>='));
            AlertOperator.operators.push(new AlertOperator('LE','أقل أو يساوي', '<='));
        }

        return AlertOperator.operators;
    }

    public static fromOperationSymbol(operationSymbol: string): AlertOperator {
        for(let operation of AlertOperator.getOperators()) {
            if(operation.operationSymbol == operationSymbol) {
                return operation;
            }
        }
        return null;
    }

    public static fromId(id: string): AlertOperator {
        for(let operation of AlertOperator.getOperators()) {
            if(operation.id == id) {
                return operation;
            }
        }
        return null;
    }
}
