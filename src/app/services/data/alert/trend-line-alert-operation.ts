import {Tc} from '../../../utils';

export class TrendLineAlertOperation {
    constructor(
        public type: TrendLineAlertOperationType,
        public arabic: string,
        public english: string
    ) {
    }

    private static trendLineAlertOperations: TrendLineAlertOperation[] = [];

    public static getTrendLineAlertOperations(): TrendLineAlertOperation[] {
        if (TrendLineAlertOperation.trendLineAlertOperations.length == 0) {
            TrendLineAlertOperation.trendLineAlertOperations.push(new TrendLineAlertOperation(TrendLineAlertOperationType.CROSS_UP, 'اختراق خط اتجاه للأعلى', 'Break Up Trend Line'));
            TrendLineAlertOperation.trendLineAlertOperations.push(new TrendLineAlertOperation(TrendLineAlertOperationType.CROSS_DOWN, 'اختراق خط اتجاه للأسفل', 'Break Down Trend Line'));
        }
        return TrendLineAlertOperation.trendLineAlertOperations;
    }

    public static fromType(type: TrendLineAlertOperationType): TrendLineAlertOperation {
        let result = TrendLineAlertOperation.getTrendLineAlertOperations().find(operation => operation.type == type);
        Tc.assert(result != null, 'Unsupported Trend Line Alert Operation Value');
        return result;
    }
}

export enum TrendLineAlertOperationType {
    CROSS_UP = 1,
    CROSS_DOWN
}
