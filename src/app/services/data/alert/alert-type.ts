import {Tc} from '../../../utils';


export class AlertTypeWrapper {
    constructor(
        public type: AlertType,
        public arabic: string,
        public english: string
    ) {

    }

    private static allWrappers: AlertTypeWrapper[] = [];

    private static getAlertTypeWrappers(): AlertTypeWrapper[] {
        if (AlertTypeWrapper.allWrappers.length == 0) {
            this.allWrappers.push(new AlertTypeWrapper(AlertType.NORMAL, 'تنبيه بسيط', 'Simple Alert'));
            this.allWrappers.push(new AlertTypeWrapper(AlertType.TREND, 'تنبيه خط اتجاه', 'Trend Line Alert'));
            this.allWrappers.push(new AlertTypeWrapper(AlertType.TECHNICAL, 'تنبيه رسم بياني', 'Chart Alert'));
        }
        return AlertTypeWrapper.allWrappers;
    }

    public static fromType(alertType: AlertType): AlertTypeWrapper {
        let result = AlertTypeWrapper.getAlertTypeWrappers().find(wrapper => wrapper.type == alertType);
        Tc.assert(result != null, 'Unsupported Alert Type Value: ' + alertType);
        return result;
    }
}

export enum AlertType {
    NORMAL = 1,
    TREND,
    TECHNICAL
}
