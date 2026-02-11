import {Tc} from '../../../utils';

export enum AppModeFeatureType {
     BROKER_CONNECTION_BTN = 1,
     LOADER_SHOW_SIGNIN_MODAL,
     SUPPORT,
     POWERED_BY_TICKER_CHART,
     BIG_TRADES_FILTER,
     TIME_AND_SALE_FILTER,
     PUBLISH_IDEA,
     DERAYAH_LOGOUT,
     SET_CHART_SIGNATURE,
     MY_PROFILE_INFO,
     END_DERAYAH_SESSION,
     MARKET_WATCH_ADD_NEW_FILTER,
     MARKET_WATCH_EDIT_FILTER,
     CLOSE_PAGE_TAB_ICON,
     ADD_NEW_PAGE_TAB_ICON,
     INCREASE_MAX_NUMBER_OF_BOXES,
     TECHNICAL_SCOPE_SCREEN,
     MAJOR_SHAREHOLDERS_SCREEN,
     ANALYSIS_CENTER_SCREEN,
     SHOW_TRADES_SUMMARY,
     COMMUNITY_WINDOWS,
     FILTER,
     LOGOUT_CONFIRMATION_MESSAGE,
     RESET_WORKSPACE_BTN,
     MARKET_ALERTS_FILTER,
     MARKET_ALERTS_COMPANY_FILTER,
     MARKET_ALERTS_ACTION_FILTER,
     MARKET_ALERTS_CANCEL_FILTER,
     MARKET_ALERTS_SHOW_TOOLBOX,
     MARKET_ALERTS_EYE_FILTER,
     SELECT_DERAYAH_BROKER,
     CHOOSE_ALERT_METHOD,
     ALERT_SEND_EMAIL,
     ALERT_SEND_MOBILE,
     DERAYAH_ANNOTATION_DELAYED_MESSAGE,
     INACTIVE_TAB_CLOSE_BTN,
     WORKSPACE_IN_ANOTHER_TAB_MSG,
     MESSAGE_FROM_TICKERCHART,
     BROKER_MODE_UPGRADE_MESSAGE,
     BROKER_MODE_GUID_SERVICE,
     ACCOUNT_SUBSCRIPTION_TYPE,
     SUBSCRIPTION_END_DATE,
     ACCOUNT_INFO,
     TRADING_MENU,
     SAVE_WORKSPACE,
     CONTACT_US,
     FONT_SIZE,
     CUSTOM_PREDEFINED_WATCHLIST,
     DERAYAH_MODE_AUTHENTICATION,
     DERAYAH_ANNOTATION_DELAYED,
     CHECK_SUBSCRIBED_MARKETS,
     DERAYAH_MODE_LOGIN,
     MAX_DEPTH_ROWS,
     ALLOW_ANALYSIS_CENTER,
     SHOW_CHART_MENU_TRADING_CONTAINER,
     ALLOW_FLASH_MESSAGE,
     SHOW_FOLLOW_PREDEFINED_WATCHLISTS,
     BROKER_USER_NAME,
     MARKET_MOVERS_SCREEN ,
}

export class AppModeFeature {

    static features:AppModeFeature[] = [];

    constructor(public type:AppModeFeatureType, public access:AppModeAccessType[]) { }

    static getFeature(featureType:AppModeFeatureType): AppModeFeature {
        let result:AppModeFeature = AppModeFeature.getFeatures().find(feature => feature.type == featureType);
        Tc.assert(result != null, "fail to find feature");
        return result;
    }

    static getAccess(featureType: AppModeFeatureType): AppModeAccessType[] {
        return this.getFeature(featureType).access;
    }

    private static getFeatures():AppModeFeature[] {
        if(!AppModeFeature.features.length) {
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.BROKER_CONNECTION_BTN, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.LOADER_SHOW_SIGNIN_MODAL, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SUPPORT , [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.POWERED_BY_TICKER_CHART, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.BIG_TRADES_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.TIME_AND_SALE_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.PUBLISH_IDEA, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.DERAYAH_LOGOUT, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SET_CHART_SIGNATURE, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MY_PROFILE_INFO, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.END_DERAYAH_SESSION, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_WATCH_ADD_NEW_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_WATCH_EDIT_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.CLOSE_PAGE_TAB_ICON, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ADD_NEW_PAGE_TAB_ICON, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.INCREASE_MAX_NUMBER_OF_BOXES, [AppModeAccessType.DERAYAH]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.TECHNICAL_SCOPE_SCREEN, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_MOVERS_SCREEN, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MAJOR_SHAREHOLDERS_SCREEN, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ANALYSIS_CENTER_SCREEN, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SHOW_TRADES_SUMMARY, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.COMMUNITY_WINDOWS, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.FILTER, [AppModeAccessType.TICKER_CHART]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.LOGOUT_CONFIRMATION_MESSAGE, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.RESET_WORKSPACE_BTN, [AppModeAccessType.DERAYAH]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_COMPANY_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_ACTION_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_ACTION_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_CANCEL_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_SHOW_TOOLBOX, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MARKET_ALERTS_EYE_FILTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SELECT_DERAYAH_BROKER, [AppModeAccessType.DERAYAH]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.CHOOSE_ALERT_METHOD, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ALERT_SEND_EMAIL, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ALERT_SEND_MOBILE, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.DERAYAH_ANNOTATION_DELAYED_MESSAGE, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.INACTIVE_TAB_CLOSE_BTN, [AppModeAccessType.DERAYAH]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.WORKSPACE_IN_ANOTHER_TAB_MSG, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MESSAGE_FROM_TICKERCHART, [AppModeAccessType.TICKER_CHART]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.BROKER_MODE_UPGRADE_MESSAGE, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.BROKER_MODE_GUID_SERVICE, [AppModeAccessType.DERAYAH]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ACCOUNT_SUBSCRIPTION_TYPE, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SUBSCRIPTION_END_DATE, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ACCOUNT_INFO, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.TRADING_MENU, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SAVE_WORKSPACE, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.CONTACT_US, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.FONT_SIZE, [AppModeAccessType.TICKER_CHART]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.CUSTOM_PREDEFINED_WATCHLIST, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.DERAYAH_MODE_AUTHENTICATION, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.DERAYAH_ANNOTATION_DELAYED, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.CHECK_SUBSCRIBED_MARKETS, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.DERAYAH_MODE_LOGIN, [AppModeAccessType.DERAYAH]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.MAX_DEPTH_ROWS, [AppModeAccessType.DERAYAH]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ALLOW_ANALYSIS_CENTER, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SHOW_CHART_MENU_TRADING_CONTAINER, [AppModeAccessType.TICKER_CHART]));

            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.ALLOW_FLASH_MESSAGE, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SHOW_FOLLOW_PREDEFINED_WATCHLISTS, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.SHOW_TRADES_SUMMARY, [AppModeAccessType.TICKER_CHART]));
            AppModeFeature.features.push(new AppModeFeature(AppModeFeatureType.BROKER_USER_NAME, [AppModeAccessType.DERAYAH]));
        }
        return AppModeFeature.features;
    }

}

export enum AppModeAccessType {
    TICKER_CHART,
    DERAYAH ,
}
