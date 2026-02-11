import {Injectable} from '@angular/core';
import {FlashMessage, FlashMessageType} from './flash-message';
import {Subject, timer} from 'rxjs/index';
import {AuthorizationService} from '../auhtorization';
import {ChannelRequestType} from '../shared-channel/channel-request';
import {UpgradeMessageChannelRequest, UpgradeMessageType} from '../../components/modals/popup/upgrade-message';
import {LanguageService} from '../state/language';
import {MiscStateService, SharedChannel, WhatIsNewService} from '../index';
import {AppBrowserUtils, AppTcTracker} from '../../utils';
import {BuiltFlashMessage, BuiltinFlashMessageType} from './builtin-flash-message';
import {WhatsNewMessage} from '../state/what-is-new/whats-new-message';

@Injectable()
export class FlashMessageService {

    private blockSendingMessage:boolean = false;
    private pendingMessages:FlashMessage[] = [];
    private flashMessageStream:Subject<FlashMessage> = new Subject();

    constructor(private authorizationService:AuthorizationService,
                private sharedChannel:SharedChannel,
                private miscStateService:MiscStateService,
                private languageService:LanguageService,
                private whatIsNewService:WhatIsNewService) {

        // show what is new
        if( this.whatIsNewService.hasMessage()) {
            this.showWhatIsNewMessage();
            this.whatIsNewService.markMessageAsDisplayed();
        }

        // show download chrome message
        if(this.notChromeBrowser()) {
          this.showChromeMessage();
        }

        // show upgrade messages
        if(authorizationService.isVisitor()){
            this.keepShowingVisitorMessages();
        } else if(authorizationService.isRegistered()) {
            if(!this.isFreeMarketSelected()) {
                this.keepShowingUpgradeToBasicMessage();
            }
        }

        // timer to keep pushing messages to be displayed
        timer(5 * 1000, 1000).subscribe(() => {
            this.pushMessage();
        })

    }

    public showTechnicalDrawingsMessage() {
        if(this.pendingMessages.length == 0){
            this.addTechnicalDrawingMessage();
        }
    }

    public onMessageDisplayCompleted(): void {
        window.setTimeout(() => {
            this.blockSendingMessage = false;
        }, 1000 * 60);
    }

    public getFlashMessageStream():Subject<FlashMessage> {
        return this.flashMessageStream;
    }

    private keepShowingUpgradeToBasicMessage() {
        timer(1000 * 5, 1000 * 60 * 5).subscribe(() => {
            this.addUpgradeToBasicMessage();
        });
    }

    private keepShowingVisitorMessages() {
        if(!this.isFreeMarketSelected()) {
            timer(1000 * 5, 1000 * 60 * 5).subscribe(() => {
                this.addUpgradeToBasicMessage();
            });
        }
        timer(1000 * 60 * 2, 1000 * 60 * 5).subscribe(() => {
            this.addSignupMessage();
        });
    }

    private pushMessage() {

        if(this.blockSendingMessage) { // cannot send message right now
            return;
        }

        if(this.pendingMessages.length == 0) {
            return;
        }

        this.blockSendingMessage = true;
        this.flashMessageStream.next(this.pendingMessages.shift());

    }

    private showChromeMessage() {
        let builtinMessage = BuiltFlashMessage.getBuiltinFlashMessage(BuiltinFlashMessageType.CHROME);
        let messageText:string = this.languageService.arabic ? builtinMessage.arabicMessage : builtinMessage.englishMessage;
        let buttonText:string = this.languageService.arabic ? builtinMessage.arabicButton : builtinMessage.englishButton;
        this.pendingMessages.push({type: FlashMessageType.ERROR, duration: 15, messageText: messageText, buttonText: buttonText, buttonCb: () => {
            window.location.href = 'https://www.google.com/chrome/browser/desktop/index.html';
            }});
    }

    private showWhatIsNewMessage() {
        let flashMessage = WhatsNewMessage.toFlashMessage(this.languageService.getLanguage(), 30);
        flashMessage.buttonCb = () => {
            AppTcTracker.trackWhatIsNewAction();
        }
        this.pendingMessages.unshift(flashMessage);
    }

    private addUpgradeToBasicMessage() {
        let builtinMessage = BuiltFlashMessage.getBuiltinFlashMessage(BuiltinFlashMessageType.UPGRADE_BASIC);
        let messageText:string = this.languageService.arabic ? builtinMessage.arabicMessage : builtinMessage.englishMessage;
        let buttonText:string = this.languageService.arabic ? builtinMessage.arabicButton : builtinMessage.englishButton;

        if(AppBrowserUtils.isMobile()) {
            messageText = 'البيانات متأخرة بـ' +  ' <span class="english large-number">15</span> ' + 'دقيقة';
            buttonText = 'للمشاهدة اللحظية';
        }

        if (this.pendingMessages.length == 0) {
            this.pendingMessages.push({
                type: FlashMessageType.WARNING, duration: 30, messageText: messageText, buttonText: buttonText, buttonCb: () => {
                    this.showUpgradeToBasicSubscriptionDialog();
                }
            });
        }
    }

    private isFreeMarketSelected(): boolean {
        if(this.miscStateService.getSelectedMarket() === 'FRX') {
            return true;
        }
        return false;
    }

    private addSignupMessage() {
        let builtinMessage = BuiltFlashMessage.getBuiltinFlashMessage(BuiltinFlashMessageType.SIGN_UP);
        let messageText:string = this.languageService.arabic ? builtinMessage.arabicMessage : builtinMessage.englishMessage;
        let buttonText:string = this.languageService.arabic ? builtinMessage.arabicButton : builtinMessage.englishButton;

        if(AppBrowserUtils.isMobile()) {
            messageText = 'سجل مجانا لكي تحفظ رسومك الفنية';
            buttonText = 'التسجيل';
        }

        if (this.pendingMessages.length == 0) {
            this.pendingMessages.push({
                type: FlashMessageType.INFO, duration: 30, messageText: messageText, buttonText: buttonText, buttonCb: () => {
                    this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
                }
            });
        }
    }

    private addTechnicalDrawingMessage() {
        if(AppBrowserUtils.isMobile()) {
            return;
        }
        let builtinMessage = BuiltFlashMessage.getBuiltinFlashMessage(BuiltinFlashMessageType.SAVE_DRAWINGS);
        let messageText:string = this.languageService.arabic ? builtinMessage.arabicMessage : builtinMessage.englishMessage;
        let buttonText:string = this.languageService.arabic ? builtinMessage.arabicButton : builtinMessage.englishButton;
        if (this.pendingMessages.length == 0) {
            this.pendingMessages.push({
                type: FlashMessageType.WARNING, duration: 30, messageText: messageText, buttonText: buttonText, buttonCb: () => {
                    this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
                }
            });
        }
    }

    private showUpgradeToBasicSubscriptionDialog() {
        let upgradeMessageRequest: UpgradeMessageChannelRequest = {
            type: ChannelRequestType.UpgradeMessage,
            upgradeMessageType: UpgradeMessageType.BASIC_SUBSCRIPTION
        };
        this.sharedChannel.request(upgradeMessageRequest);
    }

    private notChromeBrowser():boolean {
        let isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        let isEdge = window.navigator.userAgent.toLowerCase().indexOf("edge") > -1;
        return (isFirefox || isEdge);
    }


}




