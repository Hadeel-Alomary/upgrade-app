import {Tc} from '../../../utils/index';
import {StreamerChannel} from '../streamer-channel/streamer-channel';
import {HeartbeatManager} from './heartbeat-manager';
import {MessageType} from '../shared/index';
import {HeartbeatMessage} from '../shared';
import {StreamerType} from '../shared/streamerType';

export abstract class AbstractStreamer {

    protected channel:StreamerChannel;
    protected subscribedTopics:string[] = [];
    private streamerUrl: string;

    constructor(private heartbeatManager:HeartbeatManager, private streamerType:string) {}

    initChannel(streamerUrl:string, connectImmediately: boolean) {
        this.streamerUrl = streamerUrl;
        if(connectImmediately) {
            this.initConnectionOnce();
        }
    }

    reInitChannel(streamerUrl:string) {
        this.streamerUrl = streamerUrl;
        this.initStreamerChannel();
    }

    onDestroy() {
        if(this.channel) {
            this.channel.disconnect();
        }
    }

    protected subscribeHeartbeat(){
        this.subscribeTopic(this.getHeartBeatTopic());
        this.monitorMarket();
    }

    protected monitorMarket() {
        this.heartbeatManager.monitorMarket(this.streamerType);
    }

    protected getHeartBeatTopic(): string {
        if (this.streamerType.startsWith("I_")){ // remove I_ from indicator's heartbeat topic.
            return `HB.HB.${this.streamerType.replace('I_','')}`;
        }
        return `HB.HB.${this.streamerType}`;
    }

    protected abstract onMessageReceive(message:unknown):void;

    protected getMessageType(topic:string) : MessageType {

        if(topic.startsWith('QO.')){
            return MessageType.QUOTE;
        } else if(topic.startsWith('TAS.')) {
            return MessageType.TIME_AND_SALE;
        } else if(topic.startsWith('HB.HB.')) {
            return MessageType.HEARTBEAT;
        } else if(topic.startsWith('MSE.MSE') || (this.streamerType !== 'TAD' && topic.startsWith('MS.MS'))) {
            return MessageType.MARKET_SUMMARY;
        } else if(topic.startsWith('MBO.')) {
            return MessageType.MARKET_DEPTH_BY_ORDER;
        } else if(topic.startsWith('MBO10.')) {
            return MessageType.MARKET_DEPTH_BY_ORDER_10;
        } else if(topic.startsWith('MBP.')) {
            return MessageType.MARKET_DEPTH_BY_PRICE;
        } else if(topic.startsWith('MBP10.')) {
            return MessageType.MARKET_DEPTH_BY_PRICE_10;
        } else if(topic.startsWith('MA.MA.')) {
            return MessageType.MARKET_ALERT;
        } else if(topic.startsWith('BT.BT.')) {
            return MessageType.BIG_TRADE;
        } else if(topic.startsWith('ALERT.TC.')) {
            return MessageType.ALERTS;
        } else if(topic.startsWith('NEWS.NEWS.')) {
            return MessageType.NEWS;
        } else if(topic.startsWith('COM.ANA.')) {
            return MessageType.ANALYSIS;
        } else if(topic.startsWith('VT.TC.')) {
            return MessageType.VIRTUAL_TRADING;
        } else if(topic.indexOf('.liquidity.') > -1) {
            return MessageType.LIQUIDITY;
        }else if(topic.startsWith('COM.NOT.')) {
            return MessageType.COMMUNITY_NOTIFICATIONS;
        }else if(topic.startsWith('CMIN.')) {
            return MessageType.CHART_INTRADAY;
        }else if(topic.startsWith('CDAY.')) {
            return MessageType.CHART_DAILY;
        }else if(topic.indexOf('.num-alerts.') > -1){
            return MessageType.TECHNICAL_SCOPE;
        } else if(topic.indexOf('NA.') > -1 ) {
            return MessageType.TECHNICAL_SCOPE_QUOTE; //Technical Scope for market watch
        }else if(topic.indexOf('I.') > -1){
            return MessageType.TECHNICAL_INDICATOR;
        }else if(topic.startsWith('financial')) {
            return MessageType.FINANCIAL
        }

        Tc.error("fail to extract message type from topic " + topic);

        return null;
    }


    // MA all calls to topic subscriptions should go from here, in order to track what topics are
    // subscribed to and avoid duplicate in subscriptions
    protected subscribeTopic(topic:string) {
        this.initConnectionOnce();
        if(!this.subscribedTopics.includes(topic)){
            this.subscribedTopics.push(topic);
            this.channel.subscribeTopic(this.prepareTopicToSend(topic));
        }
    }

    public subscribePulseTopic(topic: string) {
        this.initConnectionOnce();
        this.subscribedTopics.push(topic);
        this.channel.subscribeTopic(this.prepareTopicToSend(topic));
    }

    protected unSubscribeTopic(topic:string) {
        if(this.subscribedTopics.includes(topic)){
            this.subscribedTopics.splice(this.subscribedTopics.indexOf(topic) , 1);
            this.channel.unSubscribeTopic(topic);
        }
    }

    protected subscribeTopics(topics:string[]) {
        this.initConnectionOnce();
        let notSubscribedTopics:string[] = topics.filter(topic => !this.subscribedTopics.includes(topic));
        let groupedTopics:string[] = this.groupTopics(notSubscribedTopics);
        notSubscribedTopics.forEach(topic => this.subscribedTopics.push(topic));
        groupedTopics.forEach(groupedTopic =>  this.channel.subscribeTopic(this.prepareTopicToSend(groupedTopic)));
    }

    protected unSubscribeTopics(topics:string[]) {
        let subscribedTopics:string[] = topics.filter(topic => this.subscribedTopics.includes(topic));
        let groupedTopics:string[] = this.groupTopics(subscribedTopics);
        subscribedTopics.forEach(topic => this.subscribedTopics.splice(this.subscribedTopics.indexOf(topic) , 1));
        groupedTopics.forEach(groupedTopic =>  this.channel.unSubscribeTopic(groupedTopic));
    }

    protected groupTopics(topics:string[]):string[]{
        // MA We had an issue on Safari (websocket error of not sending a frame)
        // As a solution, we are reducing the number of frames by grouping every 50 frames together
        // similar to TickerChart
        let groupedTopics:string [] = [];
        let tmpTopics:string[] = topics.slice(0);
        while(0 < tmpTopics.length) {
            let topicsBatch:string[] = tmpTopics.splice(0, 50);
            groupedTopics.push(topicsBatch.join(','));
        }
        return groupedTopics;
    }

    protected processHeartbeatMessage(message:HeartbeatMessage){
        message.market = this.streamerType;
        this.heartbeatManager.heartbeatReceived(message.market);
        console.log("Heartbeat " + message.market);
    }

    private initConnectionOnce() {
        if(!this.isConnectionEstablished()) {
            this.initStreamerChannel();
            this.subscribeHeartbeat();
        }
    }

    private isConnectionEstablished() {
        return this.channel != null;
    }

    private initStreamerChannel() {

        // MA if an existing channel exists, then disconect
        if(this.channel) {
            this.channel.disconnect();
        }

        // let url = Config.isProd() ? this.market.streamerUrl : "http://54.88.245.204:9005/streamhub/";
        let url = this.streamerUrl;
        // MA construct new channel
        this.channel = new StreamerChannel();
        this.channel.getMessageStream()
            .subscribe( message => this.onMessageReceive(message));
        this.channel.initWebSocket(url, this.isTickerChartStreamer());

        // MA resubscribe all previous topics with this new channel (on reconnect)
        this.reSubscribeTopics();
    }

    private isTickerChartStreamer(): boolean {
        let isTickerChartStreamer: boolean = this.streamerType != StreamerType.Musharaka && this.streamerType != StreamerType.Bsf && this.streamerType != StreamerType.Alkhabeercapital;
        return isTickerChartStreamer;
    }

    protected prepareTopicToSend(topic: string): string {
        return this.isTickerChartStreamer() ? `subscribe=${topic}` : topic;
    }

    protected reSubscribeTopics() {
        let groupedTopics:string[] = this.groupTopics(this.subscribedTopics);
        groupedTopics.forEach(groupedTopic =>  this.channel.subscribeTopic(this.prepareTopicToSend(groupedTopic)));
    }
}
