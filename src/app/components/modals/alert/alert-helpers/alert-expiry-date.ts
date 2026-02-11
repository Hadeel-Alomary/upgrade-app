import {Tc} from '../../../../utils';

export class AlertExpiryDate{

    constructor(public type:AlertExpiryDateType, public name:string){}

     static alertExpiryDates:AlertExpiryDate[] = [];

    public static getAlertExpiryDates():AlertExpiryDate[]{
        if(AlertExpiryDate.alertExpiryDates.length <= 0){
            AlertExpiryDate.alertExpiryDates.push(new AlertExpiryDate(AlertExpiryDateType.OneDay, 'يوم')),
            AlertExpiryDate.alertExpiryDates.push(new AlertExpiryDate(AlertExpiryDateType.TwoDays, 'يومان')),
            AlertExpiryDate.alertExpiryDates.push(new AlertExpiryDate(AlertExpiryDateType.ThreeDays, 'ثلاثة ايام')),
            AlertExpiryDate.alertExpiryDates.push(new AlertExpiryDate(AlertExpiryDateType.OneWeek, 'اسبوع')),
            AlertExpiryDate.alertExpiryDates.push(new AlertExpiryDate(AlertExpiryDateType.TwoWeeks, 'اسبوعان')),
            AlertExpiryDate.alertExpiryDates.push(new AlertExpiryDate(AlertExpiryDateType.OneMonth, 'شهر'))
        }
        return AlertExpiryDate.alertExpiryDates;
    }

    public static fromType(type: AlertExpiryDateType): AlertExpiryDate {
        let result = this.getAlertExpiryDates().find(alert => alert.type == type);
        Tc.assert(result != null, 'Unsupported alert expiry date type');
        return result;
    }
}

export enum AlertExpiryDateType{
    OneDay = 1,
    TwoDays = 2,
    ThreeDays = 3,
    OneWeek = 7,
    TwoWeeks = 14,
    OneMonth = 30
}
