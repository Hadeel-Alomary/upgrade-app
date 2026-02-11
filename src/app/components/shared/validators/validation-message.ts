import {LanguageService} from '../../../services/index';

export class ValidationMessage {

    static validationMessages: { [type: number]: string } = {};

    static fillAllMessages() {
        ValidationMessage.validationMessages[ValidationMessageType.RequiredInput] = 'الخانة مطلوبة';
        ValidationMessage.validationMessages[ValidationMessageType.MoreThanOrEqualNumber] = 'يجب أن تكون القيمة أكبر من أو تساوي [VALUE]';
        ValidationMessage.validationMessages[ValidationMessageType.LessThanOrEqualNumber] = 'يجب أن تكون القيمة أقل من أو تساوي [VALUE]';
        ValidationMessage.validationMessages[ValidationMessageType.IntegerValueOnly] = 'يرجى إدخال رقم صحيح';
        ValidationMessage.validationMessages[ValidationMessageType.Email] = 'البريد الإلكتروني غير صحيح';
        ValidationMessage.validationMessages[ValidationMessageType.PhoneNumber] = 'رقم الهاتف غير صحيح';
        ValidationMessage.validationMessages[ValidationMessageType.UsernameExistError] = 'إسم المستخدم غير مستخدم';
        ValidationMessage.validationMessages[ValidationMessageType.UsernameNotExistError] = 'الاسم مستخدم من قبل، الرجاء اختيار اسم مستخدم آخر';
        ValidationMessage.validationMessages[ValidationMessageType.EmailExistError] = 'البريد الإلكتروني غير مستخدم';
        ValidationMessage.validationMessages[ValidationMessageType.EmailNotExistError] = 'البريد الالكتروني مستخدم من قبل';
        ValidationMessage.validationMessages[ValidationMessageType.MobileExistError] = 'رقم الجوال غير مستخدم';
        ValidationMessage.validationMessages[ValidationMessageType.MobileNotExistError] = 'رقم الجوال مستخدم من قبل';
        ValidationMessage.validationMessages[ValidationMessageType.MatchText] = 'القيمة غير مطابقة';
        ValidationMessage.validationMessages[ValidationMessageType.Alphanumeric] = 'الرجاء فقط استخدام الحروف والأرقام الانجليزية';
        ValidationMessage.validationMessages[ValidationMessageType.MinLength] = 'يجب أن تحتوي الخانة على أكثر من [VALUE] حروف';
        ValidationMessage.validationMessages[ValidationMessageType.PublishNickNameAvailable] = 'الاسم مستخدم من قبل، الرجاء اختيار اسم مستخدم آخر';
    }

    public static getMessage(type: ValidationMessageType, languageService: LanguageService, param?: string) {

        if (Object.keys(ValidationMessage.validationMessages).length == 0) {
            ValidationMessage.fillAllMessages();
        }

        let message: string = languageService.translate(ValidationMessage.validationMessages[type]);

        if(message.indexOf('[VALUE]') !== -1) {
            message = message.replace('[VALUE]', param ? param : '');
        }

        return message;

    }
}

export enum ValidationMessageType {
    RequiredInput = 1,
    MoreThanOrEqualNumber,
    LessThanOrEqualNumber,
    IntegerValueOnly,
    Email,
    PhoneNumber,
    UsernameNotExistError,
    EmailNotExistError,
    MobileNotExistError,
    UsernameExistError,
    EmailExistError,
    MobileExistError,
    MatchText,
    Alphanumeric,
    MinLength,
    PublishNickNameAvailable
}
