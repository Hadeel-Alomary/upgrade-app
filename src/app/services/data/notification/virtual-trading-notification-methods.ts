import {NotificationMethods, NotificationMethodType} from './notification-methods';

export class VirtualTradingNotificationMethods extends NotificationMethods {

    constructor() {
        super();
        this.setMethod(NotificationMethodType.APP, '');
    }

    public toRequestObject(): Object[] {
        let result = [];
        for (let type in this.getMethods()) {
            result.push({
                method_type: NotificationMethodType[type],
                method_param: this.getMethods()[type]
            });
        }
        return result;
    }
}
