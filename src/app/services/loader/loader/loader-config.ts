import {Tc} from "../../../utils/index";

export interface MarketAlertConfig {
    key:string,
    english:string,
    arabic:string,
}

export interface MarketAlertsConfig {
    [key:string]: {
        key: string,
        english: string,
        arabic: string
    }
}

export interface ContactUsConfig {
    fromDay:string,
    toDay:string,
    fromTime:string,
    toTime:string,
    whatsAppNumber:string,
    insideSaudiNumber:string,
    outsideSaudiNumber:string,
}

export class LoaderConfig {
    marketAlerts: MarketAlertsConfig;
    contactUs: ContactUsConfig;
    guidInterval: number;
    guidKey:string;
    urls:{[key:string]:string};
    brokerUser:string;
    enableAlrajhi: boolean

    static url(config:LoaderConfig, type:LoaderUrlType):string {
        return config.urls[Tc.enumString(LoaderUrlType, type)];
    }

    static marketAlertsConfig(config:LoaderConfig, type:LoaderUrlType):string {
        return config.urls[Tc.enumString(LoaderUrlType, type)];
    }

    static brokerUser(config:LoaderConfig): string {
        return config.brokerUser;
    }
}

export enum LoaderUrlType {
    AlertsBase,
    AnnouncementSearch,
    AnnouncementLatest,
    AnnouncementCategory,
    NewsTitle,
    Guid,
    BrokerGuid,
    HostPort,
    AnalysisProfilesList,
    AnalysisSearch,
    DerayahIntegrationLink,
    MarketsTickSize,
    VirtualTradingUrl,
    AnalystsList,
    AnalysisByMarket,
    AnalysisByCompany,
    CommunityIdeas,
    CommunityNotifications,
    CommunityMyIdeas,
    MarkNotificationsAsRead,
    CommunityUserProfileUrl,
    CommunityHomePageUrl,
    CommunityIdeaUrl,
    CommunityCompanyUrl,
    CommunityMarketUrl,
    CommunityPublishChart,
    CommunityProfileInfo,
    CommunitySaveProfile,
    CommunityNickNameCheck,
    CommunityCategoriesList,
    CommunityTagsSearch,
    TcWebsiteUpgradeSubscription,
    TcWebsiteTokenGenerator,
    TcWebsiteRedirect,
    TcWebsiteViewSubscribtions,
    TcWebsiteSubscribe,
    TcWebsiteReward,
    Screenshots,
    TechnicalScopeUrl,
    Shareholders,
    TradestationIntegrationLink,
    TcWebsiteDerayahInfo,
    TcWebsiteSnbcapitalInfo,
    TcWebsiteVirtualTradingInfo,
    TcWebsiteTradestationInfo,
    DerayaAuthUrl,
    DerayahOauthBaseUrl,
    DerayaTokenUrl,
    DerayahClientId,
    DerayahClientSecret,
    DerayahTokenBySessionUrl,
    DerayahNotifications,
    RiyadcapitalBaseUrl,
    RiyadcapitalRefreshInterval,
    TcWebsiteRiyadcapitalInfo,
    AlinmainvestBaseUrl,
    AlinmainvestOauthBaseUrl,
    AlinmainvestRefreshInterval,
    TcWebsiteAlinmainvestInfo,
    AljaziracapitalBaseUrl,
    AljaziracapitalRefreshInterval,
    TcWebsiteAljaziracapitalInfo,
    AlinmainvestPortfolioBaseUrl,
    AlinmainvestOrdersBaseUrl,
    AlinmainvestClientId,
    AlinmainvestClientSecret,
    BrokerRegisterLink,
    CompaniesAndCategories,
    Streamers,
    PredefinedWatchlists,
    FollowedPredefinedWatchlists,
    SaveFollowingWatchlists,
    TcWebsiteAlrajhiInfoUrl,
    FinancialBaseUrl,
    AlrajhiRefreshInterval,
    IndexCalculationUrl
}

