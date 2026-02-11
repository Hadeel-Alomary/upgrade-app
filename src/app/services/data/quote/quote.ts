import {QuoteMessage} from '../../streaming/index';
import {Company, CompanyFlag, LoaderConfig, MarketAlertConfig, Sector} from '../../loader/index';
import {Analysis, News, NormalAlert} from '../../../services/index';
import {Tc} from '../../../utils/index';
import {TechnicalScopeSignal} from '../technical-scope';
import {TechnicalSignalState} from '../technical-scope/technical-scope-signal';

export class Quote {

    id:string;

    arabic:string;
    english:string;
    name:string;
    symbol:string;
    index:boolean;
    sector: Sector;

    flag:string;
    flagAnnouncement:string;
    isSectionRow: boolean;

    flashing:{up:string[], down:string[]};
    changeSet: string[];

    open:number;
    high:number;
    low:number;
    close:number;
    last:number;
    lastVolume:number;
    previousClose:number;
    previousHigh:number;
    previousLow:number;
    volume:number;
    amount:number;
    trades:number;

    direction:string;
    change:number;
    changePercent:number;

    askVolume:number;
    askPrice:number;
    bidPrice:number;
    bidVolume:number;
    totalAskVolume:number;
    totalBidVolume:number;

    liquidityInflowValue:number;
    liquidityOutflowValue:number;
    liquidityInflowOrders:number;
    liquidityOutflowOrders:number;
    liquidityInflowVolume:number;
    liquidityOutflowVolume:number;
    liquidityNet:number;
    liquidityFlow:number;
    liquidityInflowPercent:number;

    date:string;
    time:string;

    week52High:number;
    week52Low:number;

    preOpenPrice:number;
    preOpenVolume:number;
    preOpenChange:number;
    preOpenChangePercentage:number;

    fairPrice:number;

    priceInIndex:number;
    changeInIndex:number;
    weightInIndex:number;
    weightInSector:number;
    effectOnIndex:number;
    effectOnSector:number;

    effectIndex: number;
    effectSector: number;

    limitUp:number;
    limitDown:number;
    maxLastVolume: number;

    openingValue:number;
    openingVolume:number;
    openingTrades:number;

    valueOnClosingPrice:number;
    volumeOnClosingPrice:number;
    tradesOnClosingPrice:number;

    limitUpReached:boolean;
    limitDownReached:boolean;

    alert:NormalAlert;
    news:News;
    analysis:Analysis;

    issuedshares:number;
    freeshares:number;
    parvalue: number;

    pivot:number;
    range:number;

    support1:number;
    support2:number;
    support3:number;
    support4:number;
    resistance1:number;
    resistance2:number;
    resistance3:number;
    resistance4:number;

    phigh:number;
    plow:number;
    alerttype:string;
    alertev:string;
    alerttime:string
    marketalerts:MarketAlertsQuoteMessage;
    technicalscope: TechnicalSignalState;

    isSubscriber: boolean
    isRealTimeMarket: boolean

    private static quoteDataGuard:Quote = {
        arabic:null,
        english:null,
        name:null,
        id:null,
        sector: null,
        symbol:null,
        index:null,
        flag:null,
        flagAnnouncement:null,
        isSectionRow: null,
        flashing:null,
        changeSet: null,
        open:null,
        high:null,
        low:null,
        close:null,
        last:null,
        lastVolume:null,
        previousClose:null,
        previousHigh: null,
        previousLow:null,
        volume:null,
        amount:null,
        trades:null,
        direction:null,
        change:null,
        changePercent:null,
        askVolume:null,
        totalAskVolume:null,
        askPrice:null,
        bidPrice:null,
        bidVolume:null,
        totalBidVolume:null,
        liquidityInflowValue:null,
        liquidityOutflowValue:null,
        liquidityInflowOrders:null,
        liquidityOutflowOrders:null,
        liquidityInflowVolume:null,
        liquidityOutflowVolume:null,
        liquidityNet:null,
        liquidityFlow:null,
        liquidityInflowPercent:null,
        limitUp:null,
        limitDown:null,
        maxLastVolume: null,
        limitUpReached:null,
        limitDownReached:null,
        date:null,
        time:null,
        week52High:null,
        week52Low:null,
        preOpenPrice:null,
        preOpenVolume:null,
        preOpenChange:null,
        preOpenChangePercentage:null,
        fairPrice:null,
        priceInIndex:null,
        changeInIndex:null,
        weightInIndex:null,
        weightInSector:null,
        effectOnIndex:null,
        effectOnSector:null,

        effectIndex: null,
        effectSector: null,

        openingValue:null,
        openingVolume:null,
        openingTrades:null,
        valueOnClosingPrice:null,
        volumeOnClosingPrice:null,
        tradesOnClosingPrice:null,

        alert:null,
        news:null,
        analysis:null,

        issuedshares:null,
        freeshares:null,
        parvalue:null,

        pivot:null,
        range:null,

        support1:null,
        support2:null,
        support3:null,
        support4:null,
        resistance1:null,
        resistance2:null,
        resistance3:null,
        resistance4:null,

        phigh:null,
        plow:null,

        alerttype:null,
        alertev:null,
        alerttime:null,
        marketalerts:null,
        technicalscope:null,

        isSubscriber: null,
        isRealTimeMarket: null
    };

    private static messageToQuoteFieldsMapping:{[key:string]:string} = {
        'open':'open',
        'high':'high',
        'low':'low',
        'last':'close',
        'volume':'volume',
        'value':'amount',
        'lasttradeprice':'last',
        'lastvolume':'lastVolume',
        'direction':'direction',
        'change':'change',
        'pchange':'changePercent',
        'askvolume':'askVolume',
        'askprice':'askPrice',
        'bidprice':'bidPrice',
        'bidvolume':'bidVolume',
        'tbv':'totalBidVolume',
        'tav':'totalAskVolume',
        'trades':'trades',

        'pclose':'previousClose',
        'phigh': 'previousHigh',
        'plow': 'previousLow',
        'inflowvalue':'liquidityInflowValue',
        'outflowvalue':'liquidityOutflowValue',
        'inflowvolume':'liquidityInflowVolume',
        'outflowvolume':'liquidityOutflowVolume',
        'infloworders':'liquidityInflowOrders',
        'outfloworders':'liquidityOutflowOrders',

        'week52high':'week52High',
        'week52low':'week52Low',

        'gclose':'preOpenPrice',
        'gvolume':'preOpenVolume',
        'gchange':'preOpenChange',
        'gpchange':'preOpenChangePercentage',

        'date':'date',
        'time':'time',

        'fairPrice':'fprice',
        'iclose':'priceInIndex',
        'ichange':'changeInIndex',
        'wgi':'weightInIndex',
        'wsi':'weightInSector',
        'egi':'effectOnIndex', // for market watch screen.
        'esi':'effectOnSector', // for market watch screen.

        'gegi': 'effectIndex', // for pre-open screen.
        'gesi': 'effectSector', //for pre-open screen.

        'max': 'limitUp',
        'min': 'limitDown',
        'maxlv': 'maxLastVolume',

        'ovalue':'openingValue',
        'ovolume':'openingVolume',
        'otrades':'openingTrades',

        'cvalue':'valueOnClosingPrice',
        'cvolume':'volumeOnClosingPrice',
        'ctrades':'tradesOnClosingPrice',

        'alerttype':'alerttype',
        'alertev':'alertev',
        'alerttime':'alerttime',
    };

    private static subscribersQuoteFields: string[] = ['ovalue', 'ovolume', 'otrades', 'cvalue', 'cvolume', 'ctrades', 'phigh' , 'plow' ,
        'inflowvolume' , 'outflowvolume', 'infloworders', 'outfloworders' ,'week52high','week52low','gclose','gvolume',
        'gchange', 'gpchange', 'fairPrice','iclose','ichange','wgi','wsi','egi','esi','gegi', 'gesi', 'alerttype','alertev','alerttime'];

    private static nonNumericFields: string[] = ['direction', 'date', 'time', 'alerttype', 'alertev', 'alerttime'];

    // from .net: "open", "high", "low", "lasttradeprice", "last", "bidprice", "askprice", "week52high", "week52low"
    private static flashingFields: string[] = ['open', 'high', 'low', 'last', 'close', 'bidPrice', 'askPrice'];


    constructor(company: Company, market: string, isRealTimeMarket: boolean,companyFlag: CompanyFlag, sector: Sector, isSubscriber: boolean) {
        let flag: string = companyFlag ? companyFlag.flag : '';
        let flagAnnouncement: string = companyFlag ? companyFlag.announcement : '';
        this.isSubscriber = isSubscriber;
        this.isRealTimeMarket = isRealTimeMarket;
        this.id = company.symbol;
        this.arabic = company.arabic;
        this.english = company.english;
        this.name = company.name;
        this.symbol = company.symbol;
        this.index = company.index;
        this.sector = sector;
        this.flag = flag.toLowerCase();
        this.flagAnnouncement = flagAnnouncement;
        this.flashing = {up: [], down: []};
        this.changeSet = [];
        this.alert = null;
        this.news = null;
    }

    // MA refer to note written regarding Alerts on quote.service
    static updateAlert(quote: Quote, alert: NormalAlert) {
        quote.flashing = {up: [], down: []};
        quote.changeSet = [];
        quote.alert = alert;
        quote.changeSet.push('alert');
    }

    static updateNews(quote: Quote, news: News) {
        quote.flashing = {up: [], down: []};
        quote.changeSet = [];
        quote.news = news;
        quote.changeSet.push('news');
    }

    static updateAnalysis(quote: Quote, analysis: Analysis) {
        quote.flashing = {up: [], down: []};
        quote.changeSet = [];
        quote.analysis = analysis;
        quote.changeSet.push('analysis');
    }

    static update(quote: Quote, message: QuoteMessage , loaderConfig: LoaderConfig) {
        quote.flashing = {up: [], down: []};
        quote.changeSet = [];
        Object.keys(message).forEach(messageField => {
            if (messageField in Quote.messageToQuoteFieldsMapping) { // ignore fields we aren't handling
                let quoteField: string = Quote.messageToQuoteFieldsMapping[messageField];
                let newQuoteValue: string | number = Quote.nonNumericFields.includes(quoteField) ? message[messageField] : +message[messageField];
                quote.changeSet.push(quoteField);
                if (Quote.flashingFields.includes(quoteField)) {
                    if (newQuoteValue > quote[quoteField]) {
                        quote.flashing.up.push(quoteField);
                    } else if (newQuoteValue < quote[quoteField]) {
                        quote.flashing.down.push(quoteField);
                    }
                }

                let updateValue: boolean = true;
                if(!quote.isSubscriber && Quote.subscribersQuoteFields.includes(messageField)){
                    //Ehab: If client is not subscriber don't provide quotes values.
                    updateValue = false;
                }
                if (updateValue) {
                    quote[quoteField] = newQuoteValue;
                }
            }
        }, this);

        if(quote.changeSet.includes('liquidityInflowValue') ||
           quote.changeSet.includes('liquidityOutflowValue')){
            // computed fields
            quote.liquidityNet = quote.liquidityInflowValue - quote.liquidityOutflowValue;
            quote.liquidityFlow = quote.liquidityOutflowValue == 0 ? NaN : quote.liquidityInflowValue / quote.liquidityOutflowValue;
            quote.liquidityInflowPercent = (quote.liquidityInflowValue * 100) /
                (quote.liquidityInflowValue + quote.liquidityOutflowValue) ;
            quote.changeSet.push('liquidityNet', 'liquidityFlow', 'liquidityInflowPercent');
        }

        if (quote.changeSet.includes('alerttype') && quote.isSubscriber) {
            let config: MarketAlertConfig = loaderConfig.marketAlerts[message.alerttype.toLowerCase()];
            if (config) {
                quote.marketalerts = {arabic: config.arabic , english: config.english, alertType: quote.alerttype, alertEv: quote.alertev, alertTime: quote.alerttime}
                quote.changeSet.push('marketalerts')
            }
        }

        quote.limitUpReached = Quote.isLimitUp(quote);
        quote.limitDownReached = Quote.isLimitDown(quote);

        Quote.runtimeCheckQuoteDataType(quote);
    }

    private static isLimitUp(quote: Quote) {
        if(quote.index) { return false; }
        if(isNaN(quote.close) || isNaN(quote.high)){ return false; }
        return quote.limitUp <= quote.close;
    }

    private static isLimitDown(quote: Quote) {
        if(quote.index) { return false; }
        if(isNaN(quote.close) || isNaN(quote.limitDown)){ return false; }
        return quote.close <= quote.limitDown;
    }


    static isValidQuote(quote: Quote): boolean {

        if (isNaN(quote.open) ||
            isNaN(quote.high) ||
            isNaN(quote.low) ||
            isNaN(quote.close) ||
            isNaN(quote.volume) ||
            isNaN(quote.amount) ||
            quote.date.indexOf('#') != -1 // date contains hash(es)
        ) {
            return false;
        }

        return true;
    }

    private static runtimeCheckQuoteDataType(quote: Quote) {
        Object.keys(quote).forEach(key => {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
        quote.changeSet.forEach(key => {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
        quote.flashing.up.forEach(key => {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
        quote.flashing.down.forEach(key => {
            Tc.assert(key in Quote.quoteDataGuard, "fail to find runtime attribute in QuoteData: " + key);
        });
    }

    static updateTechnicalIndicator(quote: Quote, colName: string, val: number) {
        quote.flashing = {up: [], down: []};
        quote.changeSet = [];
        quote[colName] = val;
        quote.changeSet.push(colName);
    }

    static updateMarketWatchTechnicalScope(quote: Quote, signal: string, value: string) {
        quote.flashing = {up: [], down: []};
        quote.changeSet = [];
        quote.technicalscope = TechnicalScopeSignal.evalTechnicalSignalState(signal, value);
        quote.changeSet.push('technicalscope');
    }
}

export class Quotes {

    static quotes:Quotes; // MA ** the holder of Quotes all-cross the app! **

    data: {[symbol:string]:Quote} = {};
    list: Quote[] = [];

    length():number {
        return Object.keys(this.data).length;
    }

}

export interface MarketAlertsQuoteMessage {
    arabic: string,
    english: string,
    alertType: string,
    alertEv: string,
    alertTime: string
}
