import {AlertTriggerType} from './alert-trigger';
import {AbstractAlert, AlertHistory} from './abstract-alert';
import {AlertType} from './alert-type';
import {Company} from '../../loader/loader';
import {NotificationMethods} from '../notification';
// import {IntervalType} from 'tc-web-chart-lib';

export abstract class HostedAlert extends AbstractAlert {
    constructor(
        id: string,
        paused: boolean,
        reactivateMinutes: boolean,
        triggerType: AlertTriggerType,
        fireOnChange: boolean,
        expiryDate: string,
        message: string,
        language: string,
        expired: boolean,
        createdAt: string,
        updatedAt: string,
        company: Company,
        lastTriggerTime: string,
        history: AlertHistory[],
        notificationMethods: NotificationMethods,
        type: AlertType,
        deleted: boolean,
        public hostId: string,
    ) {
        super(id, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired,
            createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted);
    }
}
