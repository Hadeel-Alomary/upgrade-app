import {Subject} from "rxjs";
import {MarketUtils, Tc} from '../../../utils/index';
import {Market} from "../../loader/index";
import {HeartbeatManager} from "./heartbeat-manager";
import {QuoteMessage, TimeAndSaleMessage, MarketSummaryMessage, MarketDepthMessage, MarketAlertMessage, MessageType, HeartbeatMessage} from '../shared/index';
import {AbstractStreamer} from "./abstract-streamer";
import {DebugModeService} from '../../debug-mode/index';
import {RealTimeChartUpdaterMessage} from 'tc-web-chart-lib';
import {AuthorizationService} from '../../auhtorization';

export class MarketStreamer extends AbstractStreamer {

    private quoteMessageStream:Subject<QuoteMessage>;
    private ChartIntradayMessageStream:Subject<RealTimeChartUpdaterMessage>;
    private ChartDailyMessageStream:Subject<RealTimeChartUpdaterMessage>;
    private timeAndSaleMessageStream:Subject<TimeAndSaleMessage>;
    private marketSummaryStream:Subject<MarketSummaryMessage>;
    private marketDepthByOrderStream:Subject<MarketDepthMessage>;
    private marketAlertStream:Subject<MarketAlertMessage>;
    private bigTradeStream:Subject<TimeAndSaleMessage>;

    // MA TODO if market depth by price screen request a suscription before loader finishes,
    // then we will end up subscribing in MBP (and maybe market is MBP10)
    // Later on, if this causes issues, revise this logic.
    private marketDepthByPriceTopic:string = '';
    private marketDepthByOrderTopic:string = '';

    private market:Market;

    constructor(heartbeatManager:HeartbeatManager, private streamerMarket:Market, private debugModeService:DebugModeService,private authorizationService:AuthorizationService){

        super(heartbeatManager, streamerMarket.abbreviation);

        this.market = streamerMarket;

        this.quoteMessageStream = new Subject();
        this.timeAndSaleMessageStream = new Subject();
        this.marketSummaryStream = new Subject();
        this.marketDepthByOrderStream = new Subject();
        this.marketAlertStream = new Subject();
        this.bigTradeStream = new Subject();

        this.ChartIntradayMessageStream = new Subject();
        this.ChartDailyMessageStream = new Subject();

        this.marketDepthByPriceTopic = this.market.marketDepthByPriceTopic;
        this.marketDepthByOrderTopic = this.market.marketDepthByOrderTopic;


        if(this.debugModeService.connectToDebugStreamer()) {
            this.initChannel(this.debugModeService.getDebugStreamerUrl(), true);
        }else {
            this.initChannel(this.market.streamerUrl, true);
        }
    }

    onDestroy() {
        super.onDestroy();
    }

    subscribeQuote(symbol:string) {
        let topic:string = `QO.${symbol}`;
        this.subscribeTopic(topic);
    }

    subscribeQuotes(symbols: string[]) {
        let topics: string[] = [];
        symbols.forEach((symbol: string) => {
            topics.push(`QO.${symbol}`);
        });
        this.subscribeTopics(topics);
    }

    unSubscribeQuote(symbol: string) {
        let topic:string = `QO.${symbol}`;
        this.unSubscribeTopic(topic);
    }

    unSubscribeQuotes(symbols:string[]) {
        let topics: string[] = [];
        symbols.forEach((symbol: string) => {
            topics.push(`QO.${symbol}`);
        });
        this.unSubscribeTopics(topics);
    }

    subscribeTimeAndSale(symbol:string) {
        if (this.authorizationService.isVisitor()) {return}
        let topic:string = `TAS.${symbol}`;
        this.subscribeTopic(topic);
    }

    unSubscribeTimeAndSale(symbol:string) {
        let topic:string = `TAS.${symbol}`;
        this.unSubscribeTopic(topic);
    }

    subscribeMarketSummary() {
        if(this.market.abbreviation == 'TAD') {
            this.subscribeTopic(`MSE.MSE.${this.market.abbreviation}`);
        }else{
            this.subscribeTopic(`MS.MS.${this.market.abbreviation}`);
        }
    }

    subscribeMarketDepthByOrder(symbol:string) {
        if (this.authorizationService.isVisitor() || !this.marketDepthByOrderTopic) {return}
        this.subscribeTopic(`${this.marketDepthByOrderTopic}.${symbol}`);
    }

    subscribeMarketDepthByPrice(symbol:string) {
        if (this.authorizationService.isVisitor() || !this.marketDepthByPriceTopic) {return}
        this.subscribeTopic(`${this.marketDepthByPriceTopic}.${symbol}`);
    }

    unSubscribeMarketDepthByOrder(symbol:string) {
        if (this.authorizationService.isVisitor() || !this.marketDepthByOrderTopic) {return}
        this.unSubscribeTopic(`${this.marketDepthByOrderTopic}.${symbol}`);
    }

    unSubscribeMarketDepthByPrice(symbol:string) {
        if (this.authorizationService.isVisitor()) {return}
        this.unSubscribeTopic(`${this.marketDepthByPriceTopic}.${symbol}`);
    }

    subscribeMarketAlerts() {
        if (this.authorizationService.isVisitor()) {return}
        this.subscribeTopic(`MA.MA.${this.market.abbreviation}`);
    }

    subscribeBigTrade() {
        if (this.authorizationService.isVisitor()) {return}
        this.subscribeTopic(`BT.BT.${this.market.abbreviation}`);
    }

    subscribeChartIntrday(symbol:string) {
        let topic:string = `CMIN.${symbol}`;
        this.subscribeTopic(topic);
    }

    unSubscribeChartIntrday(symbol:string) {
        let topic:string = `CMIN.${symbol}`;
        this.unSubscribeTopic(topic);
    }

    subscribeChartDaily(symbol:string) {
        let topic:string = `CDAY.${symbol}`;
        this.subscribeTopic(topic);
    }

    unSubscribeChartDaily(symbol:string) {
        let topic:string = `CDAY.${symbol}`;
        this.unSubscribeTopic(topic);
    }

    getQuoteMessageStream():Subject<QuoteMessage> {
        return this.quoteMessageStream;
    }

    getTimeAndSaleMessageStream():Subject<TimeAndSaleMessage> {
        return this.timeAndSaleMessageStream;
    }

    getChartIntradayMessageStream():Subject<RealTimeChartUpdaterMessage> {
        return this.ChartIntradayMessageStream;
    }

    getChartDailyMessageStream():Subject<RealTimeChartUpdaterMessage> {
        return this.ChartDailyMessageStream;
    }

    getMarketSummaryStream():Subject<MarketSummaryMessage> {
        return this.marketSummaryStream;
    }

    getMarketDepthByOrderStream():Subject<MarketDepthMessage> {
        return this.marketDepthByOrderStream;
    }

    getMarketAlertStream():Subject<MarketAlertMessage> {
        return this.marketAlertStream;
    }

    getBigTradeStream():Subject<TimeAndSaleMessage> {
        return this.bigTradeStream;
    }


    protected onMessageReceive(message:{[key:string]:unknown}) {
        let messageType:MessageType = this.getMessageType(message['topic'] as string);

        switch(messageType){
            case MessageType.QUOTE:
                this.processQuoteMessage(message as QuoteMessage);
                break;
            case MessageType.TIME_AND_SALE:
                this.processTimeAndSaleMessage(message as TimeAndSaleMessage);
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message as HeartbeatMessage);
                break;
            case MessageType.MARKET_SUMMARY:
                this.processMarketSummaryMessage(message as MarketSummaryMessage);
                break;
            case MessageType.MARKET_DEPTH_BY_ORDER:
            case MessageType.MARKET_DEPTH_BY_PRICE:
            case MessageType.MARKET_DEPTH_BY_PRICE_10:
            case MessageType.MARKET_DEPTH_BY_ORDER_10:
                this.processMarketDepthMessage(messageType, message as MarketDepthMessage);
                break;
            case MessageType.MARKET_ALERT:
                this.processMarketAlertMessage(message as MarketAlertMessage);
                break;
            case MessageType.BIG_TRADE:
                this.processBigTradeMessage(message as TimeAndSaleMessage);
                break;
            case MessageType.CHART_INTRADAY:
                this.processChartIntradayMessage(message as RealTimeChartUpdaterMessage);
                break;
            case MessageType.CHART_DAILY:
                this.processChartDailyMessage(message as RealTimeChartUpdaterMessage);
                break;
            default:
                Tc.error("unknown message type " + messageType + " for message " + message);
                break;
        }

    }

    private processQuoteMessage(message:QuoteMessage){
        let topicSegments:string[] = MarketUtils.splitTopic(message.topic);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        this.quoteMessageStream.next(message);
    }

    private processTimeAndSaleMessage(groupedMessage:TimeAndSaleMessage){
        (this.splitGroupedMessage(groupedMessage) as TimeAndSaleMessage[]).forEach(message => {
            let topicSegments:string[] = MarketUtils.splitTopic(message['topic']);
            message.symbol = topicSegments[1] + '.' + topicSegments[2];
            this.timeAndSaleMessageStream.next(message);
        });
    }

    private processChartIntradayMessage(message:RealTimeChartUpdaterMessage){
        let topicSegments:string[] = MarketUtils.splitTopic(message['topic']);
            message.symbol = topicSegments[1] + '.' + topicSegments[2];
            this.ChartIntradayMessageStream.next(message);
    }

    private processChartDailyMessage(message:RealTimeChartUpdaterMessage){
        let topicSegments:string[] = MarketUtils.splitTopic(message['topic']);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        this.ChartDailyMessageStream.next(message);
    }

    private processBigTradeMessage(groupedMessage:TimeAndSaleMessage){
        (this.splitGroupedMessage(groupedMessage) as TimeAndSaleMessage[]).forEach(message => {
            message.symbol = message['symbol'];
            this.bigTradeStream.next(message);
        });
    }

    private processMarketSummaryMessage(message:MarketSummaryMessage) {
        message.market = this.market.abbreviation;
        this.marketSummaryStream.next(message);
    }

    private processMarketDepthMessage(messageType:MessageType, message:MarketDepthMessage){
        let topicSegments:string[] = MarketUtils.splitTopic(message['topic']);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        message.groupedByPrice =
            (messageType != MessageType.MARKET_DEPTH_BY_ORDER &&
            messageType != MessageType.MARKET_DEPTH_BY_ORDER_10);
        this.marketDepthByOrderStream.next(message);
    }

    private processMarketAlertMessage(groupedMessage:MarketAlertMessage) {
        (this.splitGroupedMessage(groupedMessage) as MarketAlertMessage[]).forEach(message => {
            this.marketAlertStream.next(message);
        });
    }

    private splitGroupedMessage(groupedMessage:{[key:string]:unknown}):{[key:string]:unknown} {

        let fields:{[key:string]:string[]} = {};

        let numberOfMessages:number = -1;

        Object.keys(groupedMessage).forEach( key => {

            if(key == 'topic'){ return; } // MA topic is not grouped

            let values:string[] = (groupedMessage[key] as string).split(';');
            values.pop(); // remove the last value as we have an extra separator ';' at end

            if(numberOfMessages == -1){
                numberOfMessages = values.length;
            } else { // ensure that length of all fields is the same
                Tc.assert(numberOfMessages == values.length, "wrong number of grouped fields");
            }

            fields[key] = values;

        });

        let messages:{[key:string]:string}[] = [];

        for(let index:number = 0; index < numberOfMessages; ++index){
            let message:{[key:string]:string} = {};
            message['topic'] = groupedMessage['topic'] as string; // not grouped field
            Object.keys(fields).forEach( key => {
                message[key] = fields[key][index];
            });
            messages.push(message);
        }

        return messages;

    }

}
