// TODO use it with the trading objects.
// import {EnumUtils} from 'tc-web-chart-lib';

export class NotificationMethods {
    private methods: {[method: number]: string} = {};

    constructor() {
        this.methods[NotificationMethodType.APP] = 'True-0';
    }

    public static fromResponseData(response: NotificationMethodResponse[]): NotificationMethods {
        let methods = new NotificationMethods();
        for (let responseObject of response) {
            // methods.setMethod(EnumUtils.enumStringToValue(NotificationMethodType, responseObject.method_type), responseObject.method_param);
        }
        return methods;
    }

    public getMethods(): {[method: number]: string} {
        return this.methods;
    }

    public setMethod(type: NotificationMethodType, param: string): void {
        this.methods[type] = param;
    }

    public removeMethod(type: NotificationMethodType): void {
        delete this.methods[type];
    }

    public getParam(type: NotificationMethodType): string {
        return this.methods[type];
    }

    public sendEmail(): boolean {
        return NotificationMethodType.EMAIL in this.methods && this.methods[NotificationMethodType.EMAIL] != null && this.methods[NotificationMethodType.EMAIL] != '';
    }

    public sendSMS(): boolean {
        return NotificationMethodType.SMS in this.methods && this.methods[NotificationMethodType.SMS] != null && this.methods[NotificationMethodType.SMS] != '';
    }

    public sendMobileNotification(): boolean {
        return NotificationMethodType.MOBILE in this.methods && this.methods[NotificationMethodType.MOBILE] == '1';
    }

    public toRequestObject(): Object[] {
        let result = [];
        for (let type in this.methods) {
            result.push({
                type: NotificationMethodType[type],
                param: this.methods[type]
            });
        }
        return result;
    }
}

export enum NotificationMethodType {
    APP = 1,
    EMAIL,
    SMS,
    MOBILE,
}

export interface NotificationMethodResponse {
    method_type: string,
    method_param: string
}
