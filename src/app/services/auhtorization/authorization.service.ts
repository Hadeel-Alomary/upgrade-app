import {Injectable} from '@angular/core';
import {CredentialsStateService} from '../state/credentials/credentials-state.service';
import {Feature, FeatureType} from './feature';
import {Access, AccessType} from './access-type';
import {ChannelRequestType} from '../shared-channel/channel-request';
import {SharedChannel} from '../shared-channel';
// import {UpgradeMessageChannelRequest, UpgradeMessageType} from '../../components/modals/popup/upgrade-message/upgrade-message-channel-request';
import {AppTcTracker} from '../../utils';
import {AppModeAuthorizationService} from './app-mode-authorization';
// import {ChartLibTechnicalIndicatorType, ChartLibTechnicalDrawingType} from 'tc-web-chart-lib';

@Injectable()
export class AuthorizationService {

    constructor(private credentialsStateService:CredentialsStateService, private sharedChannel:SharedChannel, private appModeAuthorizationService: AppModeAuthorizationService) {}

    private accessType:AccessType = AccessType.VISITOR;

    authorize(featureType: FeatureType, cb: () => void, isMarketAuthorized: boolean = true, currentCounter: number = 0, isMarketGridBoxIncludedInPage: boolean = false) {
        // Ehab: upgradeMessageType when the user is Professional subscriber to the one market like Saudi then try to use professional feature like
        // (adding alert, adding one of the liquidity indicators) then we need to show him
        // message like: هذه الميزة تدعم الأسواق ذات الاشتراكات المدفوعة فقط.
        let feature = Feature.getFeature(featureType);

        let upgradeMessageType: number ;
        if(feature.access === AccessType.BASIC_SUBSCRIPTION) {
            upgradeMessageType = AccessType.BASIC_SUBSCRIPTION;
        } else if(feature.access === AccessType.ADVANCED_SUBSCRIPTION){
            upgradeMessageType = AccessType.ADVANCED_SUBSCRIPTION;
        } else {
            upgradeMessageType = AccessType.PROFESSIONAL_SUBSCRIPTION;
        }
        let isValidFeatureCount: boolean = true;

        if (this.isVisitor()) {
            this.sharedChannel.request({ type: ChannelRequestType.SignInOrSignUp });
            return false;
        }

        let isMarketGridBoxInPage: boolean = this.isBasicSubscriber() || this.isAdvanceSubscriber() ? isMarketGridBoxIncludedInPage : false;

        if (this.authorizeFeature(featureType)) {
            if (isMarketAuthorized) {
              if(isMarketGridBoxInPage || !this.isValidFeatureCount(feature, currentCounter)){
                    //Screens Count Limit is exceeded.
                    isValidFeatureCount = false;
                    // upgradeMessageType = this.getUpgradeMessage(feature);
                } else { //Authorized
                    cb();
                    return true;
                }
            }
        }

        // let upgradeMessageRequest: UpgradeMessageChannelRequest = {
        //     type : ChannelRequestType.UpgradeMessage,
        //     upgradeMessageType: upgradeMessageType,
        //     feature: feature,
        //     isMarketAuthorized: isMarketAuthorized,
        //     isMarketGridBoxIncludedInPages: isMarketGridBoxInPage,
        //     isValidFeatureCount: isValidFeatureCount,
        //     AllowedFeatureCount: this.getFeatureAllowedCounter(feature),
        // };
        // this.sharedChannel.request(upgradeMessageRequest);
        return false;
    }

    private getUpgradeMessage(feature: Feature){
        // if(this.isRegistered()) {
        //     return feature.basicCount > feature.registeredCount ? UpgradeMessageType.BASIC_SUBSCRIPTION: UpgradeMessageType.ADVANCED_SUBSCRIPTION;
        // }
        // return UpgradeMessageType.PROFESSIONAL_SUBSCRIPTION;
    }

    private isValidFeatureCount(feature: Feature, currentCounter: number): boolean {
        if (this.isProfessionalSubscriber() || currentCounter === 0) {
            return true;
        }

        let featureAllowedCounter = this.getFeatureAllowedCounter(feature);
        let companiesCounter = 0;
        let marketsCounter = 0;

        if (this.isBasicSubscriber()) {
            companiesCounter = 5;
            marketsCounter = 3;
        } else if (this.isAdvanceSubscriber()) {
            companiesCounter = 10;
            marketsCounter = 5;
        }
        if (this.isBasicSubscriber() || this.isAdvanceSubscriber()) {
            if (this.getCompanyScreens().includes(feature.type)) {
                return currentCounter < companiesCounter;
            }
            if (this.getMarketScreens().includes(feature.type)) {
                return currentCounter < marketsCounter;
            }
            currentCounter++;
            return currentCounter <= featureAllowedCounter;
        } else {
            currentCounter++;
            return currentCounter <= featureAllowedCounter;
        }
    }

    private getFeatureAllowedCounter(feature: Feature) {
        return this.accessType == AccessType.REGISTERED ? feature.registeredCount : this.accessType == AccessType.ADVANCED_SUBSCRIPTION ? feature.advancedCount : feature.basicCount;
    }

    public getCompanyScreens(): number[]{
        return [
            FeatureType.CHART_SCREEN, FeatureType.DETAILED_QUOTE_SCREEN, FeatureType.TIME_AND_SALE_SCREEN,
            FeatureType.TRADES_SUMMARY_SCREEN, FeatureType.COMPANY_NEWS_SCREEN, FeatureType.MARKET_DEPTH_BY_PRICE_SCREEN,
            FeatureType.MARKET_DEPTH_BY_ORDER_SCREEN, FeatureType.COMPANY_FINANCIAL_STATEMENTS
        ]
    }

    public getMarketScreens(): number[] {
        return [
            FeatureType.MARKET_PREOPEN_SCREEN, FeatureType.MAJOR_SHAREHOLDERS_SCREEN, FeatureType.ANALYSIS_CENTER_SCREEN,
            FeatureType.BIG_TRADES_SCREEN, FeatureType.MARKET_TRADES_SCREEN,
            FeatureType.MARKET_ALERTS_SCREEN, FeatureType.TECHNICAL_SCOPE_SCREEN, FeatureType.FINANCIAL_DATA , FeatureType.MARKET_MOVERS_SCREEN, FeatureType.INDEX_ANALYSIS_SCREEN
        ]
    }


    // public authorizedIndicators(): ChartLibTechnicalIndicatorType[] {
    //     return [ChartLibTechnicalIndicatorType.MACD, ChartLibTechnicalIndicatorType.RelativeStrengthIndex, ChartLibTechnicalIndicatorType.Volume, ChartLibTechnicalIndicatorType.SimpleMovingAverage, ChartLibTechnicalIndicatorType.ExponentialMovingAverage];
    // }
    //
    // public authorizedDrawings() {
    //     return [ChartLibTechnicalDrawingType.TrendLine, ChartLibTechnicalDrawingType.AngleLineSegment,
    //         ChartLibTechnicalDrawingType.OneOpenEndTrendLine, ChartLibTechnicalDrawingType.TwoOpenEndsTrendLine,
    //         ChartLibTechnicalDrawingType.ThreeSegmentLine,ChartLibTechnicalDrawingType.FourSegmentLine,
    //         ChartLibTechnicalDrawingType.FiveSegmentLine, ChartLibTechnicalDrawingType.EightSegmentLine,
    //         ChartLibTechnicalDrawingType.HorizontalLine, ChartLibTechnicalDrawingType.VerticalLine,
    //         ChartLibTechnicalDrawingType.ArrowLineSegment, ChartLibTechnicalDrawingType.HorizontalRay,  ChartLibTechnicalDrawingType.FiboLines,
    //         ChartLibTechnicalDrawingType.FiboExtensions, ChartLibTechnicalDrawingType.PercentExtension,
    //         ChartLibTechnicalDrawingType.PercentLines]
    // }

    authorizeService(featureType:FeatureType, cb: () => void) {
        if(this.authorizeFeature(featureType)) {
            cb();
        }
    }

    authorizeFeature(featureType: FeatureType) {
        let requiredAccessType = Feature.getAccess(featureType);
        return this.hasAccess(requiredAccessType, this.accessType);
    }

    isVisitor():boolean {
        return this.accessType == AccessType.VISITOR;
    }

    isRegistered():boolean {
        return this.accessType == AccessType.REGISTERED;
    }

    isSubscriber():boolean {
        return this.isBasicSubscriber() || this.isProfessionalSubscriber() || this.isAdvanceSubscriber();
    }

    isBasicSubscriber():boolean {
        return this.accessType == AccessType.BASIC_SUBSCRIPTION;
    }

    isProfessionalSubscriber():boolean {
        return this.accessType == AccessType.PROFESSIONAL_SUBSCRIPTION;
    }

    isAdvanceSubscriber(): boolean {
        return this.accessType == AccessType.ADVANCED_SUBSCRIPTION;
    }

    getAccessType():AccessType {
        return this.accessType;
    }

    setAccessBasedOnSubscriptionStatus(subscribed:boolean, professional:boolean, isAdvanced: boolean):void {
        if(subscribed) {
            this.accessType = professional ? AccessType.PROFESSIONAL_SUBSCRIPTION : isAdvanced ? AccessType.ADVANCED_SUBSCRIPTION : AccessType.BASIC_SUBSCRIPTION;
        } else {
            this.accessType = this.credentialsStateService.isLoggedIn() ? AccessType.REGISTERED : AccessType.VISITOR;
        }
        AppTcTracker.trackTier(Access.getAccess(this.accessType).english);
    }

    private hasAccess(requiredAccessType: AccessType, userAccessType: AccessType) {
        return requiredAccessType <= userAccessType;
    }

}
