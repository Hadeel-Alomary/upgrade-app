import {Injectable} from '@angular/core';

@Injectable()
export class AlertStateService {

    private static STORAGE_KEY: string = 'TC_ALERT';

    protected storageData: AlertState;

    constructor() {
        if(localStorage.getItem(AlertStateService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(AlertStateService.STORAGE_KEY));
        } else {
            this.storageData = {
                sendMobileNotification: false,
                email: '',
                phoneNumber: ''
            };
        }
    }

    getEmail(): string{
        return this.storageData.email;
    }

    setEmail(email: string) {
        this.storageData.email = email;
        this.write();
    }

    setSendMobileNotification(value: boolean) {
        this.storageData.sendMobileNotification = value;
        this.write();
    }

    getSendMobileNotification(): boolean{
        return this.storageData.sendMobileNotification;
    }

    getPhoneNumber(): string{
        return this.storageData.phoneNumber;
    }

    setPhoneNumber(phoneNumber: string){
        this.storageData.phoneNumber = phoneNumber;
        this.write();
    }

    private write(){
        localStorage[AlertStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }

}

interface AlertState{
    sendMobileNotification: boolean,
    email: string,
    phoneNumber: string
}
