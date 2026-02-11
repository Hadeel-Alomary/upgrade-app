import {AppBrowserUtils, StringUtils} from '../../../utils';
import {LanguageType} from '../language';
import {FlashMessage, FlashMessageType} from '../../message/flash-message';

export class WhatsNewMessage {

    private static arabicMassage: string = 'الان جميع الأسهم الامريكية والصناديق المتداولة متوفرة في تكرتشارت لايف السوق الأمريكي';
    private static arabicLinkText: string = '';
    private static englishMessage: string = 'Now all US stocks and ETFs are available in the US market';
    private static englishLinkText: string = '';
    private static link: string = '';

    private static mobileArabicMassage: string = 'الان جميع الأسهم الامريكية والصناديق المتداولة متوفرة في تكرتشارت لايف السوق الأمريكي';
    private static mobileArabicLinkText: string = '';
    private static mobileEnglishMessage: string = 'Now all US stocks and ETFs are available in the US market';
    private static mobileEnglishLinkText: string = '';
    private static mobileLink: string = '';

    public static daysCount: number = 2;
    private static messageHash:string = null;


    public static getMessageHash():string {
        if(!WhatsNewMessage.messageHash) {
            let string = [WhatsNewMessage.arabicMassage, WhatsNewMessage.arabicLinkText, WhatsNewMessage.englishMessage, WhatsNewMessage.englishLinkText, WhatsNewMessage.link].join('');
            WhatsNewMessage.messageHash = StringUtils.md5(string);
        }
        return WhatsNewMessage.messageHash;
    }

    public static hasMessage():boolean {
        return AppBrowserUtils.isMobile() ? this.mobileArabicMassage != '' : this.arabicMassage != '';
    }


    public static toFlashMessage(languageType:LanguageType, duration:number):FlashMessage {
        return AppBrowserUtils.isDesktop() ?
            WhatsNewMessage.toDesktopFlashMessage(languageType, duration) :
            WhatsNewMessage.toMobileFlashMessage(languageType, duration);
    }

    private static toDesktopFlashMessage(languageType:LanguageType, duration:number):FlashMessage {
        let flashMessage:FlashMessage = {
            type: FlashMessageType.SUCCESS,
            duration: duration,
            messageText: languageType == LanguageType.Arabic ? WhatsNewMessage.arabicMassage : WhatsNewMessage.englishMessage
        };

        if(WhatsNewMessage.link) {
            flashMessage.buttonText = languageType == LanguageType.Arabic ? WhatsNewMessage.arabicLinkText : WhatsNewMessage.englishLinkText;
            flashMessage.buttonUrl = WhatsNewMessage.link;
        }
        return flashMessage;
    }

    private static toMobileFlashMessage(languageType:LanguageType, duration:number):FlashMessage {
        let flashMessage:FlashMessage = {
            type: FlashMessageType.SUCCESS,
            duration: duration,
            messageText: languageType == LanguageType.Arabic ? WhatsNewMessage.mobileArabicMassage : WhatsNewMessage.mobileEnglishMessage
        };

        if(WhatsNewMessage.link) {
            flashMessage.buttonText = languageType == LanguageType.Arabic ? WhatsNewMessage.mobileArabicLinkText : WhatsNewMessage.mobileEnglishLinkText;
            flashMessage.buttonUrl = WhatsNewMessage.mobileLink;
        }
        return flashMessage;
    }

}
