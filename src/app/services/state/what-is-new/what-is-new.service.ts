import {Injectable} from '@angular/core';
import {WhatsNewMessage} from './whats-new-message';
import {LanguageService} from '../language';
import {Tc} from '../../../utils';

@Injectable()
export class WhatIsNewService{

    private static STORAGE_KEY:string = "TC_LAST_MESSAGE_STATE";

    private storageData: LastWhatsNewMessageState;

    constructor(private languageService: LanguageService) {
        if(localStorage.getItem(WhatIsNewService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(WhatIsNewService.STORAGE_KEY));
        } else {
            this.storageData = {
                key: WhatsNewMessage.getMessageHash(),
                day: '',
                count: 0
            };
        }
    }

    markMessageAsDisplayed():void {
        Tc.assert(WhatsNewMessage.hasMessage(), "should have message");
        this.setLastMessage(WhatsNewMessage.getMessageHash());
    }

    hasMessage():boolean{

        if(!WhatsNewMessage.hasMessage()) {
            return false;
        }

        if(WhatsNewMessage.getMessageHash() != this.storageData.key) {
            this.storageData.count = 0;
            return true;
        }

        return this.storageData.count < WhatsNewMessage.daysCount && this.storageData.day != moment().format('YYYY-MM-DD');

    }

    private setLastMessage(messageKey: string){
        this.storageData = {
            key: messageKey,
            day: moment().format('YYYY-MM-DD'),
            count: this.storageData.count + 1
        };
        this.write();
    }

    private write(){
        localStorage[WhatIsNewService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }
}

export interface LastWhatsNewMessageState {
    key: string,
    day: string,
    count: number
}
