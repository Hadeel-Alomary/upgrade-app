import {Company} from '../../loader/loader';
import {LanguageService} from '../../state/language';
import {AlertType} from './alert-type';
import {NotificationMethods} from '../notification/notification-methods';
import {AlertTriggerType} from './alert-trigger';
// import {Interval, IntervalType} from 'tc-web-chart-lib';

export abstract class AbstractAlert {
    // public static isSupportedInterval(interval: Interval): boolean {
    //     switch (interval.type) {
    //         case IntervalType.TenMinutes:
    //         case IntervalType.TwentyMinutes:
    //         case IntervalType.Quarter:
    //         case IntervalType.Year:
    //         case IntervalType.Custom:
    //             return false;
    //         default:
    //             return true;
    //     }
    // }

    protected constructor(
        public id: string,
        public paused: boolean,
        public reactivateMinutes: boolean,
        public triggerType: AlertTriggerType,
        public fireOnChange: boolean,
        public expiryDate: string,
        public message: string,
        public language: string,
        public expired: boolean,
        public createdAt: string,
        public updatedAt: string,
        public company: Company,
        public lastTriggerTime: string,
        public history: AlertHistory[],
        public notificationMethods: NotificationMethods,
        public alertType: AlertType,
        public deleted: boolean
    ) {}

    public getLastHistoryPoint(): AlertHistory {
        return this.history.length == 0 ? null : this.history[this.history.length - 1];
    }

    public getExpiryInDays(): number {
        return moment(this.expiryDate.substr(0, 10)).diff(this.createdAt.substr(0, 10), 'days');
    }

    public isActive(): boolean {
        return !this.deleted && !this.paused && !this.expired && this.lastTriggerTime == null;
    }

    public isAchieved(): boolean {
        return !this.deleted && this.expired && this.lastTriggerTime != null;
    }

    public isTrendLineAlert():boolean {
        return this.alertType == AlertType.TREND;
    }

    public isNormalAlert():boolean {
        return this.alertType == AlertType.NORMAL;
    }

    public isChartAlert():boolean {
        return this.alertType == AlertType.TECHNICAL;
    }

    public abstract getCondition(languageService: LanguageService): string;

    public abstract getEquation(): string;

    public abstract getEquationDescription(): string;

}

export interface AlertHistory {
    time: string,
    price: number
}
