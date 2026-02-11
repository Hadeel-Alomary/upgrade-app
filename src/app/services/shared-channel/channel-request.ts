import {GridBoxType} from '../../components/shared/index';
import {Chart, IChartTheme} from 'tc-web-chart-lib';
import {ChartElementsContainerTabType} from '../../components/modals/chart/chart-elements-container/chart-elements-container-tab-type';
import {ChartElementsContainer} from '../../components/chart/chart-elements-container';
import {PublishedIdea} from '../publisher/published-chart';
import {AddIntervalCaller} from '../../components/modals/add-interval/add-interval.component';
import {OverlayBoxesContainerEventType} from '../../components/shared/grid-box/market-box';
import {TcChartComponent , IBaseDrawingsSettings,IIndicatorSettingsAdvanced} from 'tc-web-chart-lib';
import {DerayahOrder} from '../trading';
import {ChartSettingsContainer} from "../../components/chart/chart-settings-container";


export enum ChannelRequestType {
    WatchlistProperties = 1,
    FollowPredefinedWatchlists,
    NewWatchlist,
    Confirmation,
    MessageBox,
    OptionalMessageBox,
    PageTitle,
    Alert,
    AlertCenter,
    GridColumnProperties,
    News,
    Analysis,
    Selection,
    SettingsMenu,
    ContactUs,
    OpenSymbol,
    OpenMarket,
    MyDrawing,
    ShowContextMenu,
    ToggleMaximizeWindow,
    Reload,
    FilterProperties,
    NewFilter,
    MarketAlertsProperties,
    ForceLogout,
    DerayahModeLogout,
    Logout,
    FilterRefresh,
    WatchlistRefresh,
    DerayahConnect,
    DerayahOrderDetails,
    DerayahQuantityCalculator,
    SnbcapitalConnect,
    SnbcapitalBuySell,
    SnbcapitalOrderDetails,
    SnbcapitalQuantityCalculator,
    SnbcapitalSettings,
    SnbcapitalTransferMoney,
    RiyadcapitalConnect,
    RiyadcapitalBuySell,
    RiyadcapitalOrderDetails,
    RiyadcapitalQuantityCalculator,
    RiyadcapitalSettings,
    AlinmainvestConnect,
    AlinmainvestBuySell,
    AlinmainvestOrderDetails,
    AlinmainvestQuantityCalculator,
    AlinmainvestSettings,
    AljaziracapitalConnect,
    AljaziracapitalBuySell,
    AljaziracapitalOrderDetails,
    AljaziracapitalQuantityCalculator,
    AljaziracapitalSettings,
    AljaziracapitalDeletedOrdersStatus,
    AljaziracapitalTransferMoney,
    AlrajhicapitalConnect,
    AlrajhicapitalTermsAndConditions,
    AlrajhicapitalBuySell,
    AlrajhicapitalOrderDetails,
    AlrajhicapitalQuantityCalculator,
    AlrajhicapitalSettings,
    AlrajhicapitalTransferMoney,
    TradingFloatingToolbar,
    VirtualTradingConnect,
    VirtualTradingBuySell,
    VirtualTradingOrderDetails,
    VirtualTradingManualPortfolioControl,
    VirtualTradingSettings,
    VirtualTradingAccount,
    VirtualTradingTransactions,
    BrokerSelection,
    DrawingSettingsDialog,
    DrawingToolbar,
    IndicatorSettingsDialog,
    IchimokuCloudSettingsDialog,
    UpgradeMessage,
    SignIn,
    SignUp,
    SignInOrSignUp,
    ForgetPassword,
    InactiveTab,
    SwitchLanguageConfirmation,
    IndicatorSelection,
    FiboDrawingSettingsDialog,
    SelectChartDrawing,
    ChartScreenshot,
    ChartSignatureDialog,
    AddSignatureDialog,
    ObjectTreeDialog,
    PublishIdea,
    PublisherProfile,
    chartSettingsDialog,
    SwitchTheme,
    WorkspaceSelect,
    WorkspaceRefresh,
    WorkspaceUpdateInProgress,
    CommunityWindows,
    SupportInfo,
    UserDefinedWatchListUpdated,
    PredefinedWatchlistUpdated,
    ForceScreenReload,
    TechnicalScopeProperties,
    AddInterval,
    UnsupportedAlertMessage,
    TradestationConnect,
    TradestationBuySell,
    TradestationMessage,
    TradestationConfirmationMessage,
    TradestationAccountTransactions,
    TradestationOrderDetails,
    TradestationSettings,
    OverlayBoxesContainer,

    OverlayContainerHiddenInMaximizedCase,
    MobileMorePages,
    GridMessage,
    SearchBox,
    AnnotationDelayed,
    DerayahBuySell,
    DerayahBuySellConfirmation,
    AlrajhicapitalBuySellConfirmation,
    MusharakaConnect,
    MusharakaBuySell,
    MusharakaOrderDetails,
    MusharakaQuantityCalculator,
    MusharakaSettings,
    BsfConnect,
    BsfBuySell,
    BsfOrderDetails,
    BsfQuantityCalculator,
    BsfSettings,
    AlkhabeercapitalConnect,
    AlkhabeercapitalBuySell,
    AlkhabeercapitalOrderDetails,
    AlkhabeercapitalQuantityCalculator,
    AlkhabeercapitalSettings,
}

export interface ChannelRequest {
    type:ChannelRequestType
}

interface OpenRequest extends ChannelRequest {
    gridBoxType:GridBoxType;
    param?: string|boolean|object
}

export interface SymbolBoxOpenRequest extends OpenRequest{
    symbol:string;
}

export interface MarketBoxOpenRequest extends OpenRequest{
    watchlistId:string
}

export interface ActionableChannelRequest extends ChannelRequest{
    requester?: ChannelRequester
}

export interface ShowDrawingSettingsDialogRequest extends ChannelRequest {
    drawingSettings : IBaseDrawingsSettings;
    caller:TcChartComponent
}

export interface ShowIndicatorSettingsDialogRequest extends ChannelRequest {
    indicatorSettings : IIndicatorSettingsAdvanced;
    caller:TcChartComponent;
}

export interface ShowDrawingToolbarRequest extends ChannelRequest {
    drawingSettings : IBaseDrawingsSettings;
    visible :boolean;
    caller:TcChartComponent;
}

export interface ChartScreenshotRequest extends ChannelRequest {
    tcChartComp: TcChartComponent;
    backgroundScreenshot?:boolean;
    backgroundScreenshotCb?: (imageBas64Data:string) => void
}


export interface ChartSignatureRequest extends ChannelRequest {
    tcChartComp: TcChartComponent;
}

export interface ShowPublishIdeaModalRequest extends ChannelRequest {
    publishedIdea: PublishedIdea;
}


export interface ShowObjectTreeDialogRequest extends ChannelRequest {
    activeTab: ChartElementsContainerTabType,
    container: ChartElementsContainer
}

export interface ShowChartSettingsDialogRequest extends ChannelRequest {
    container: ChartSettingsContainer;
    tcChartComp: TcChartComponent;
    themeType: IChartTheme
}

export interface ForceScreenReloadRequest extends ChannelRequest {
    market: string;
}

export interface TradestationChannelRequest extends ChannelRequest {
    caller: TradestationCaller,
}

export interface TradestationMessageChannelRequest extends ChannelRequest {
    messageLines: string[],
    isErrorMessage: boolean,
    showWarningMessage: boolean
}

export interface TradestationConfirmationMessageChannelRequest extends ChannelRequest {
    caller: TradestationConfirmCaller,
    messageLines: string[],
    warningMessageLines? :string[]
}

export interface OverlayBoxesContainerChannelRequest extends ChannelRequest {
    symbol:string;
    eventType:OverlayBoxesContainerEventType;
}

export interface GridMessageChannelRequest extends ChannelRequest {
    message:string,
}

export interface TradestationConfirmCaller {
    onConfirmation(confirmed:boolean):void;
}

export interface TradestationCaller {
    onCancelConnection():void;
}

export interface AlinmainvestLoginModalChannelRequest extends ChannelRequest{
    startConnectingImmediately: boolean;
}

export interface AddIntervalRequest extends ChannelRequest {
    caller: AddIntervalCaller
}

export interface AlrajhicapitalLoginChannelRequest extends ChannelRequest{
    startConnectingImmediately: boolean;
    isAlrajhiSubscriber: boolean,
}

export interface MusharakaLoginChannelRequest extends ChannelRequest {
    startConnectingImmediately: boolean;
    isMusharakaSubscriber: boolean
}

export interface BsfLoginChannelRequest extends ChannelRequest{
    startConnectingImmediately: boolean;
    isBsfSubscriber: boolean
}

export interface AlkhabeercapitalLoginChannelRequest extends ChannelRequest{
    startConnectingImmediately: boolean;
    isAlkhabeercapitalSubscriber: boolean
}

export interface ChannelRequester {
    onRequestComplete():void;
}
