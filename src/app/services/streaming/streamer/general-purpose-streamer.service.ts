import {Subject} from 'rxjs';
import {AlertMessage, AnalysisMessage, HeartbeatMessage, MessageType, NewsMessage, TradingMessage , TechnicalScopeMessage} from '../shared/index';
import {Tc} from '../../../utils/index';
import {HeartbeatManager} from './heartbeat-manager';
import {AbstractStreamer} from './abstract-streamer';
import {CommunityNotificationMessage} from '../shared/message';
import {StreamerType} from '../shared/streamerType';

export class GeneralPurposeStreamer extends AbstractStreamer{

    private alertsStreamer:Subject<AlertMessage>;
    private technicalScopeStreamer:Subject<TechnicalScopeMessage>;
    private technicalScopeQuoteStreamer: Subject<TechnicalScopeMessage>
    private newsStreamer:Subject<NewsMessage>;
    private analysisStreamer:Subject<AnalysisMessage>;
    private tradingStreamer:Subject<TradingMessage>;
    private communityNotificationsStreamer:Subject<CommunityNotificationMessage>;

    constructor(heartbeatManager:HeartbeatManager){
        super(heartbeatManager, StreamerType.GeneralPurpose);
        this.alertsStreamer = new Subject();
        this.technicalScopeStreamer = new Subject();
        this.technicalScopeQuoteStreamer = new Subject();
        this.newsStreamer = new Subject();
        this.analysisStreamer = new Subject();
        this.tradingStreamer = new Subject();
        this.communityNotificationsStreamer = new Subject();
    }


    onDestroy() {
        super.onDestroy();
    }

    public getAlertsStream():Subject<AlertMessage>{
        return this.alertsStreamer;
    }

    public getNewsStreamer():Subject<NewsMessage>{
        return this.newsStreamer;
    }

    public getAnalysisStreamer():Subject<AnalysisMessage>{
        return this.analysisStreamer;
    }

    public getTradingStreamer():Subject<TradingMessage>{
        return this.tradingStreamer;
    }

    public getCommunityNotificationsStreamer():Subject<CommunityNotificationMessage>{
        return this.communityNotificationsStreamer;
    }

    public getTechnicalScopeStreamer():Subject<TechnicalScopeMessage>{
        return this.technicalScopeStreamer;
    }

    public getTechnicalScopeQuoteStreamer(): Subject<TechnicalScopeMessage> {
        return this.technicalScopeQuoteStreamer;
    }

    public subscribeAlerts(userName:string){
        userName = userName.toUpperCase();
        this.subscribeTopic(`ALERT.TC.${userName}`);
    }

    public subscribeNews(marketAbrv:string){
        this.subscribeTopic(`NEWS.NEWS.${marketAbrv}`);
    }

    public subscribeAnalysis(marketAbrv:string){
        this.subscribeTopic(`COM.ANA.${marketAbrv}`);
    }

    public subscribeVirtualTrading(user: string){
        this.subscribeTopic(`VT.TC.${user.toUpperCase()}`);
    }

    public subscribeCommunityNotifications(userId:string){
        this.subscribeTopic(`COM.NOT.${userId}`);
    }

    protected reSubscribeTopics() {
        this.subscribedTopics.forEach(topic => {
            this.channel.subscribeTopic(this.prepareTopicToSend(topic));
        });
    }

    protected prepareTopicToSend(topic: string): string {
        return super.prepareTopicToSend(topic);
    }

    public subscribeTechnicalScope(interval: string , marketAbbr:string){
        this.subscribeTopic(`${interval}.num-alerts.${marketAbbr}`);
    }

    public unSubscribeTechnicalScope(interval: string , marketAbbr:string){
        let topic = `${interval}.num-alerts.${marketAbbr}`;
        this.unSubscribeTopic(topic);
    }

    public subscribeTechnicalScopeQuote(topics: string[]) {
        this.subscribeTopics(topics);
    }

    public unSubscribeTechnicalScopeQuote(topics: string[]) {
        this.unSubscribeTopics(topics);
    }

    protected onMessageReceive(message:{[key:string]:unknown}){
        let messageType:MessageType = this.getMessageType(message['topic'] as string);
        switch (messageType){
            case MessageType.ALERTS:
                this.processAlertsMessage(message as unknown as AlertMessage);
                break;
            case MessageType.NEWS:
                this.processNewsMessage(message as unknown as NewsMessage);
                break;
            case MessageType.ANALYSIS:
                this.processAnalysisMessage(message as unknown as AnalysisMessage);
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message as unknown as HeartbeatMessage);
                break;
            case MessageType.VIRTUAL_TRADING:
                this.processVirtualTradingMessage(message as unknown as TradingMessage);
                break;
            case MessageType.COMMUNITY_NOTIFICATIONS:
                this.processCommunityNotificationsMessage(message as unknown as CommunityNotificationMessage);
                break;
            case MessageType.TECHNICAL_SCOPE:
                    this.processTechnicalScopeMessage(message as unknown as TechnicalScopeMessage);
                    break;
            case MessageType.TECHNICAL_SCOPE_QUOTE:
                this.processTechnicalScopeQuoteMessage(message as unknown as TechnicalScopeMessage);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    }

    private processAlertsMessage(message:AlertMessage){
        this.alertsStreamer.next(message);
    }

    private processNewsMessage(message:NewsMessage){
        this.newsStreamer.next(message);
    }

    private processAnalysisMessage(message:AnalysisMessage){
        this.analysisStreamer.next(message);
    }

    protected processVirtualTradingMessage(message:TradingMessage){
        this.tradingStreamer.next(message);
    }

    private processCommunityNotificationsMessage(message:CommunityNotificationMessage){
        this.communityNotificationsStreamer.next(message);
    }
    private processTechnicalScopeMessage(message: TechnicalScopeMessage){
        this.technicalScopeStreamer.next(message);
    }

    private processTechnicalScopeQuoteMessage(message: TechnicalScopeMessage){
        this.technicalScopeQuoteStreamer.next(message);
    }

}
