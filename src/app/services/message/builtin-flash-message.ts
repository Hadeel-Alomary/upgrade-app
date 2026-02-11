import {Tc} from '../../utils';

export enum BuiltinFlashMessageType {
    CHROME, UPGRADE_BASIC, SAVE_DRAWINGS, SIGN_UP
}

export class BuiltFlashMessage {

    static messages:BuiltFlashMessage[] = [];

    constructor(public type:BuiltinFlashMessageType, public arabicMessage:string, public arabicButton:string, public englishMessage:string, public englishButton:string){}

    static getBuiltinFlashMessage(builtinFlashMessageType:BuiltinFlashMessageType):BuiltFlashMessage {
        let result:BuiltFlashMessage = BuiltFlashMessage.getMessages().find(message => message.type == builtinFlashMessageType);
        Tc.assert(result != null, "fail to find built-in messages");
        return result;
    }

    private static getMessages():BuiltFlashMessage[] {

        if(!BuiltFlashMessage.messages.length) {
            BuiltFlashMessage.messages.push(new BuiltFlashMessage(BuiltinFlashMessageType.CHROME,
                'لضمان أفضل أداء للبرنامج بدون مشاكل، يرجى استخدام متصفح جوجل كروم',
                'اضغط هنا لتحميل متصفح كروم',
                'For the best performance with no delays, please use Google Chrome Browser',
                'Download Google Chrome'));
            BuiltFlashMessage.messages.push(new BuiltFlashMessage(BuiltinFlashMessageType.UPGRADE_BASIC,
                'جميع هذه البيانات متأخرة بـ 15 دقيقة عن السوق',
                'لمشاهدة البيانات اللحظية',
                'All of the financial prices are delayed by 15 minutes from the market',
                'For Realtime Monitoring'));
            BuiltFlashMessage.messages.push(new BuiltFlashMessage(BuiltinFlashMessageType.SIGN_UP,
                'يمكنك التسجيل مجانا لاستخدام مزايا متعددة لمتابعة السوق والشركات',
                'اضغط هنا للتسجيل',
                'Create a free account and access a large selection of free tools for market monitoring',
                'Create Free Account'));
            BuiltFlashMessage.messages.push(new BuiltFlashMessage(BuiltinFlashMessageType.SAVE_DRAWINGS,
                'احفظ رسوماتك و مؤشراتك الفنية على جهازك عن طريق التسجيل المجاني',
                'اضغط هنا للتسجيل',
                'Create a free account to save you chart settings and personal drawings',
                'Create Free Account'));
        }
        return BuiltFlashMessage.messages;
    }

}
