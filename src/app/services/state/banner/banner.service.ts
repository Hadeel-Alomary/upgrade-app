import {Injectable} from '@angular/core';
import {BannerMessage} from '../../loader/loader';
import {StringUtils} from '../../../utils';

@Injectable()
export class BannerService {

    private static STORAGE_KEY:string = "TC_LAST_BANNER_STATE";

    private storageData: LastBannerState;

    private messageHash: string = null;

    constructor() {
        if(localStorage.getItem(BannerService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(BannerService.STORAGE_KEY));
        } else {
            this.storageData = {
                key: '',
                day: '',
                count: 0
            };
        }
    }

    markBannerMessageAsDisplayed(message: BannerMessage):void {
        this.setLastBannerMessage(this.hashBannerMessage(message));
    }

    showBannerMessage(message: BannerMessage):boolean{
        if(this.hashBannerMessage(message) != this.storageData.key) {
            this.storageData.count = 0;
            return true;
        }

        return this.storageData.count < message.daysCount && this.storageData.day != moment().format('YYYY-MM-DD');
    }

    private hashBannerMessage(message: BannerMessage): string {
        if(!this.messageHash) {
            let string = [message.url, message.arabicUrlText, message.englishUrlText, message.imageUrl].join('');
            this.messageHash = StringUtils.md5(string);
        }
        return this.messageHash;
    }

    private setLastBannerMessage(messageKey: string){
        this.storageData = {
            key: messageKey,
            day: moment().format('YYYY-MM-DD'),
            count: this.storageData.count + 1
        };
        this.write();
    }

    private write(){
        localStorage[BannerService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }
}

export interface LastBannerState {
    key: string,
    day: string,
    count: number
}
