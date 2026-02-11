import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ChannelListener} from '../../shared/channel-listener';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {AbstractAlert, Accessor, AlertField, AlertOperator, AlertService, AuthorizationService, ChannelRequest, ChannelRequestType, ChartAlert, ChartAlertFunction, ChartAlertIndicator, Company, LanguageService, NormalAlert, NotificationMethodType, SharedChannel, TrendLineAlert} from '../../../../services/index';
import {AppCountry, Tc} from '../../../../utils/index';
import {AlertStateService} from '../../../../services/state';
import {AlertTrigger, TrendLineAlertOperation} from '../../../../services/data/alert';
import {AlertExpiryDate, AlertExpiryDateType} from '../alert-helpers';
import {ConfirmationCaller, ConfirmationRequest, MessageBoxRequest, UpgradeMessageChannelRequest, UpgradeMessageType} from '../../popup';
import {IndicatorHelper} from 'tc-web-chart-lib';
import {TrendLineAlertOperationType} from '../../../../services/data/alert/trend-line-alert-operation';
import {CompanyTag} from '../../../../services/loader/loader/market';
import {Feature, FeatureType} from '../../../../services/auhtorization/feature';
import {AppModeFeatureType} from '../../../../services/auhtorization/app-mode-authorization';

const cloneDeep = require('lodash/cloneDeep');

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class AlertComponent extends ChannelListener<AlertChannelRequest> implements AfterViewChecked, OnDestroy, ConfirmationCaller {

    @ViewChild(ModalDirective) alertModal: ModalDirective;

    @ViewChild('alertForm') alertForm: NgForm;

    alert: AbstractAlert;
    enableSymbolSelector: boolean;

    expiryDateSelection: AlertExpiryDateType;
    sendMobileNotification: boolean;
    sendEmail: boolean;
    email: string;
    sendSMS: boolean;
    phoneNumber: string;
    countryCode: string;

    chartAlertIndicators: ChartAlertIndicator[] = [];
    private maximumNumberOfAlerts : number = Number.MAX_SAFE_INTEGER;
    appModeFeatureType = AppModeFeatureType;
    alwaysValidAlert: boolean  = false;

    get editMode(): boolean {
        return this.alert.id != null;
    }

    constructor(
        public sharedChannel: SharedChannel,
        public cd: ChangeDetectorRef,
        public alertService: AlertService,
        public accessor: Accessor,
        public alertStateService: AlertStateService,
        public languageService:LanguageService,
        private authorizationService: AuthorizationService) {
        super(sharedChannel, ChannelRequestType.Alert);
    }

    onChannelRequest() {
        this.authorizationService.authorize(FeatureType.ALERT, () => {
            this.showModal();
        });
    }


    private showModal() {
        this.alertService.alertReachedLimit().subscribe(alert => {
            if (alert.limit_reached) {
                if(this.isProfessionalSubscriber()) {
                    this.showTickerchartAlertsReachedLimitMessage()
                }else {
                    this.showUpgradesAlertsReachedLimitMessage();
                }
                return;
            } else {
                let alertSupported = this.isAlertSupported(this.channelRequest.alert.company);
                if (alertSupported) {
                    this.prepareAlert();
                    this.initFormInput();
                    this.cd.markForCheck();
                    this.alertModal.show();
                } else {
                    this.showNotSupportedMessage();
                }
            }
        });
    }

    private isProfessionalSubscriber(){
       return  this.authorizationService.isProfessionalSubscriber();
    }

    private isAlertSupported(alertCompany: Company) :boolean {
        if(!alertCompany){
           return true; //Opened from Alerts Center directly so there is no company on request
        }
        let marketAbbr = this.accessor.marketsManager.getMarketBySymbol(alertCompany.symbol).abbreviation;
        if(marketAbbr == 'USA' && !alertCompany.tags.includes(CompanyTag.USA_SUPPORTED)){
            return false;
        }
        return true;
    }

    private showNotSupportedMessage():void {
        let message: string = this.languageService.translate('ميزة التنبيهات غير متاحة لهذه الشركة');
        let request: MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message};
        this.sharedChannel.request(request);
    }

    private showTickerchartAlertsReachedLimitMessage(): void {
        let message: string = this.languageService.arabic ? 'لا يمكن اضافة اكثر من 1000 تنبيه فعال يرجى حذف تنبيه فعال للتمكن من إضافة تنبيه آخر.' : 'You cannot add more than 1000 alerts. You need to delete an existing alert to add a new one.';
        let confirmationRequest: ConfirmationRequest = {
            type: ChannelRequestType.MessageBox,
            messageLine: this.languageService.translate(message),
            caller: this
        };
        this.sharedChannel.request(confirmationRequest);
    }

    private showUpgradesAlertsReachedLimitMessage(): void {
        let feature = Feature.getFeature(FeatureType.MULTIPLE_SIMPLE_ALERTS);
        let upgradeMessageRequest: UpgradeMessageChannelRequest = {
            type : ChannelRequestType.UpgradeMessage,
            upgradeMessageType: UpgradeMessageType.PROFESSIONAL_SUBSCRIPTION,
            feature: feature,
            isMarketAuthorized: true,
            isValidFeatureCount:true
        };
        this.sharedChannel.request(upgradeMessageRequest);
    }

    ngAfterViewChecked() {
        this.validateForm();
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    prepareAlert() {
        this.alert = cloneDeep(this.channelRequest.alert);

        if (this.isChartAlert()) {
            Tc.assert(this.channelRequest.chatAlertParameters && this.channelRequest.chatAlertParameters.length > 0, 'chart alert parameters cannot be null or empty');
        }

        if (this.editMode && this.alert.message == this.alert.getCondition(this.accessor.languageService)) {
            this.alert.message = '';
        }

        if (!this.editMode) {
            this.alert.notificationMethods.setMethod(NotificationMethodType.MOBILE, this.alertStateService.getSendMobileNotification() ? '1' : '0');
            this.alert.notificationMethods.setMethod(NotificationMethodType.EMAIL, this.alertStateService.getEmail());
            this.alert.notificationMethods.setMethod(NotificationMethodType.SMS, this.alertStateService.getPhoneNumber());
        }
    }

    initFormInput() {
        this.countryCode = '+966';

        this.enableSymbolSelector = this.isTrendLineAlert() ? false : this.alert.company == null;
        let isAlwaysValid = this.alert.expiryDate.substr(0, 4) == '2099';
        if(isAlwaysValid) {
            this.alwaysValidAlert = true;
        }else {
            this.expiryDateSelection = this.getExpiryDateSelection();
        }

        this.sendSMS = this.alert.notificationMethods.sendSMS();
        if (this.sendSMS) {
            this.countryCode = this.alert.notificationMethods.getParam(NotificationMethodType.SMS).split('-')[0];
            this.phoneNumber = this.alert.notificationMethods.getParam(NotificationMethodType.SMS).split('-')[1];
        }

        this.sendEmail = this.alert.notificationMethods.sendEmail();
        if (this.sendEmail) {
            this.email = this.alert.notificationMethods.getParam(NotificationMethodType.EMAIL);
        }

        this.sendMobileNotification = this.alert.notificationMethods.sendMobileNotification();

        if (this.isChartAlert()) {
            this.chartAlertIndicators = this.channelRequest.chatAlertParameters;
            if(this.channelRequest.newValue) {
                this.chartAlert.equationDefinition.value1 = this.channelRequest.newValue;
            }
            if(this.channelRequest.newSecondValue) {
                this.chartAlert.equationDefinition.value2 = this.channelRequest.newSecondValue;
            }
        }
        this.cd.markForCheck();
    }

    getExpiryDateSelection(): AlertExpiryDateType {
        let expiryInDays = this.alert.getExpiryInDays();
        Tc.assert(Tc.enumValues(AlertExpiryDateType).includes(expiryInDays), `invalid alert expiryDate [${this.alert.expiryDate} - ${this.alert.createdAt}]`);
        return expiryInDays;
    }

    getAlertPhoneNumber(): string {
        return this.countryCode + '-' + this.phoneNumber;
    }

    onSubmit() {
        this.updateFormControlsValidation();
        if (this.alert.company && this.alertForm.valid &&  this.isAlertSupported(this.alert.company)) {

            this.accessor.authorizationService.authorize(FeatureType.ALERT, () => {
                this.updateNotificationMethods();

                this.alert.expiryDate = this.alwaysValidAlert ? moment('2099-01-01').format('YYYY-MM-DD')
                    :moment(this.alert.createdAt).add(this.expiryDateSelection, 'days').format('YYYY-MM-DD');

                if (this.alert.message == '') {
                    this.alert.message = this.alert.getCondition(this.accessor.languageService);
                }

                if(this.isChartAlert() && !this.chartAlert.hasChannelFunction()) {
                    this.chartAlert.equationDefinition.value2 = this.chartAlert.equationDefinition.value1;
                }

                if (this.editMode) {
                    this.updateOriginalAlert();
                    this.alertService.updateAlert(this.channelRequest.alert);
                } else {
                    this.alertService.createAlert(this.alert);
                }

                this.saveAlertState();
                this.hideModalAndReturnToCaller();

            },
            );
            this.resetAlertThenHideModal();
        }
    }

    private updateNotificationMethods() {
        if (this.sendMobileNotification) {
            this.alert.notificationMethods.setMethod(NotificationMethodType.MOBILE, '1');
        } else {
            this.alert.notificationMethods.removeMethod(NotificationMethodType.MOBILE);
        }
        if (this.sendSMS) {
            this.alert.notificationMethods.setMethod(NotificationMethodType.SMS, this.getAlertPhoneNumber());
        } else {
            this.alert.notificationMethods.removeMethod(NotificationMethodType.SMS);
        }
        if (this.sendEmail) {
            this.alert.notificationMethods.setMethod(NotificationMethodType.EMAIL, this.email);
        } else {
            this.alert.notificationMethods.removeMethod(NotificationMethodType.EMAIL);
        }

        //////////////////////////////////////////////////////////////////////////////////
        // MA based on Abd feedback, for now, remove notification for both mobile and SMS
        if(this.disableSMS()) {
            this.alert.notificationMethods.removeMethod(NotificationMethodType.SMS);
        }
        //////////////////////////////////////////////////////////////////////////////////

    }

    saveAlertState() {
        this.alertStateService.setSendMobileNotification(this.alert.notificationMethods.sendMobileNotification());
        this.alertStateService.setEmail(this.alert.notificationMethods.sendEmail() ? this.alert.notificationMethods.getParam(NotificationMethodType.EMAIL) : '');
        this.alertStateService.setPhoneNumber(this.alert.notificationMethods.sendSMS() ? this.alert.notificationMethods.getParam(NotificationMethodType.SMS) : '');
    }

    updateOriginalAlert() {
        this.channelRequest.alert.message = this.alert.message;
        this.channelRequest.alert.expiryDate = this.alert.expiryDate;
        this.channelRequest.alert.notificationMethods = this.alert.notificationMethods;

        if (this.isNormalAlert()) {
            (this.channelRequest.alert as NormalAlert).field = this.normalAlert.field;
            (this.channelRequest.alert as NormalAlert).value = this.normalAlert.value;
            (this.channelRequest.alert as NormalAlert).operator = this.normalAlert.operator;
        } else if (this.isTrendLineAlert()) {
            (this.channelRequest.alert as TrendLineAlert).operation = this.trendLineAlert.operation;
            (this.channelRequest.alert as TrendLineAlert).triggerType = this.trendLineAlert.triggerType;
        } else if (this.isChartAlert()) {
            (this.channelRequest.alert as ChartAlert).equationDefinition = this.chartAlert.equationDefinition;
        }
    }

    onDelete() {
        let message: string = "هل أنت متأكد أنك تريد حذف التنبيه؟";
        let confirmationRequest: ConfirmationRequest = {
            type: ChannelRequestType.Confirmation,
            messageLine: this.accessor.languageService.translate(message),
            param: this.alert,
            caller: this
        };
        this.sharedChannel.request(confirmationRequest);
        this.alertModal.hide();
    }

    onHidden() {
        // MA I cannot add any logic here, as I can hide this modal while still it is active in the background
        // as when showing the confirmation message for the delete operation and waiting for the callback to proceed.
    }

    onSelectingSymbol(symbol: string) {
        this.alert.company = this.accessor.marketsManager.getCompanyBySymbol(symbol);
    }

    onSelectingAlertOperation(operationValue: string) {
        let operationType: TrendLineAlertOperationType = +operationValue as TrendLineAlertOperationType;
        this.trendLineAlert.operation = TrendLineAlertOperation.fromType(operationType);
    }

    onSelectingTriggerType(triggerType: string) {
        this.alert.triggerType = +triggerType;
    }

    onSelectingParameter(parameterName: string) {
        this.chartAlert.parameter = cloneDeep(this.chartAlertIndicators.find(param => param.name == parameterName));
        this.chartAlert.parameter.selectedIndicatorField = this.getIndicatorFields(this.chartAlert.parameter)[0];
    }

    get countries(): AppCountry[] {
        return AppCountry.getCountries();
    }

    get operations(): TrendLineAlertOperation[] {
        return TrendLineAlertOperation.getTrendLineAlertOperations();
    }

    get triggerTypes(): AlertTrigger[] {
        return this.isTrendLineAlert() ? AlertTrigger.getTrendLineAlertTriggers() : AlertTrigger.getChartAlertTriggers();
    }

    onSelectingAlertFunction(functionType: string) {
        this.chartAlert.equationDefinition.alertFunctionType = +functionType;
    }

    getIndicatorFields(indicator: ChartAlertIndicator): string[] {
        return IndicatorHelper.getServerIndicatorFields(indicator.indicatorType);
    }

    get alertExpiryDates(): AlertExpiryDate[] {
        return AlertExpiryDate.getAlertExpiryDates();
    }

    get operators(): AlertOperator[] {
        return AlertOperator.getOperators();
    }

    get fields(): AlertField[] {
        return AlertField.getFields();
    }

    get alertFunctions(): ChartAlertFunction[] {
        return ChartAlertFunction.getAllFunctions();
    }

    get phonePattern(): string {
        return this.countryCode == '+966' ? '^\\d{9,10}$' : '^\\d+$';
    }

    get normalAlert(): NormalAlert {
        return this.alert as NormalAlert;
    }

    get trendLineAlert(): TrendLineAlert {
        return this.alert as TrendLineAlert;
    }

    get chartAlert(): ChartAlert {
        return this.alert as ChartAlert;
    }

    get title(): string {
        if(this.isNormalAlert()) {
            return 'تفاصيل التنبيه البسيط';
        } else if(this.isTrendLineAlert()) {
            return 'تفاصيل تنبيه خط الاتجاه';
        } else {
            return 'تفاصيل تنبيه الرسم البياني';
        }
    }

    isNormalAlert() {
        return this.alert.isNormalAlert();
    }

    isTrendLineAlert() {
        return this.alert.isTrendLineAlert();
    }

    isChartAlert() {
        return this.alert.isChartAlert();
    }

    showParameterValueSelectionControl(indicator: ChartAlertIndicator) {
        return IndicatorHelper.getServerIndicatorFields(indicator.indicatorType).length > 1;
    }

    validateForm() {
        if (this.alertForm) {
            this.resetInputOnDisableCheckbox('sendEmail', 'email');
            this.resetInputOnDisableCheckbox('sendSMS', 'phoneNumber');
        }
    }

    resetInputOnDisableCheckbox(checkboxName: string, inputName: string) {
        let form = this.alertForm.form;
        let checkboxControl = form.get(checkboxName);
        let inputControl = form.get(inputName);
        if (checkboxControl && inputControl) {
            if (!checkboxControl.value && (inputControl.value != '')) {
                inputControl.setValue('');
            }
        }
    }

    updateFormControlsValidation() {
        Object.values(this.alertForm.controls).forEach((control: FormControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });
    }

    getCountryDropdownName(country: AppCountry): string {
        return country.getCountryNameWithCode(this.accessor.languageService.arabic);
    }

    getOperationText(operation: TrendLineAlertOperation): string {
        return this.accessor.languageService.arabic ? operation.arabic : operation.english;
    }

    triggerTypeText(triggerType: AlertTrigger): string {
        return this.accessor.languageService.arabic ? triggerType.arabic : triggerType.english;
    }

    getFunctionText(chartFunction: ChartAlertFunction): string {
        return this.accessor.languageService.arabic ? chartFunction.arabic : chartFunction.english;
    }

    getChartAlertValueText() {
        let text = this.chartAlert.hasChannelFunction() ? 'أعلى القناة' : 'القيمة';
        return this.accessor.languageService.translate(text);
    }

    getChartAlertSecondValueText() {
        return this.accessor.languageService.translate('أسفل القناة');
    }

    onConfirmation(confirmed: boolean, param: unknown): void {
        if (confirmed) {
            let alert: AbstractAlert = param as AbstractAlert;
            this.alertService.deleteAlert(this.channelRequest.alert);
            this.hideModalAndReturnToCaller();
        } else {
            this.alertModal.show();
        }
    }

    hideModalAndReturnToCaller() {
        if (this.channelRequest.caller) {
            this.channelRequest.caller.onAlertModalClose(this.alert);
        }
        this.resetAlertThenHideModal();
    }

    private resetAlertThenHideModal() {
        this.alert = null;
        this.alwaysValidAlert = false;
        this.alertModal.hide();
    }

    private disableSMS() {
        return true;
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.accessor.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }


    public onChangeExpirationDate(alwaysValidAlert: boolean, event: Event): void {
        if (alwaysValidAlert) {
            let isAuthorized = this.accessor.authorizationService.authorize(FeatureType.ALWAYS_VALID_ALERT, () => {});
            if (isAuthorized) {
                this.alwaysValidAlert = true;
            } else {
                event.preventDefault();
            }
        } else {
            this.alwaysValidAlert = false;
            this.expiryDateSelection = this.getExpiryDateSelection();
        }

        this.cd.markForCheck();
    }

    public isUnAuthorized(): boolean {
        return !this.accessor.authorizationService.authorizeFeature(FeatureType.ALWAYS_VALID_ALERT);
    }
}

export interface AlertChannelRequestCaller {
    onAlertModalClose(alert: AbstractAlert): void;
}

export interface AlertChannelRequest extends ChannelRequest {
    alert: AbstractAlert;
    newValue?: number,
    newSecondValue?: number,
    caller?: AlertChannelRequestCaller;
    chatAlertParameters?: ChartAlertIndicator[];
}
