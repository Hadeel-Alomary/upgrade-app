import {StringUtils, Tc} from "../../../utils/index";
import {Company, MarketAlertConfig} from "../../loader/index";
import {MarketAlertMessage} from "../../streaming/index";

export class MarketAlert {

    constructor(
        public id:string,
        public key:string,
        public name:string,
        public symbol:string,
        public time:string,
        public type:string,
        public messageEnglish:string,
        public messageArabic:string,
        public color:string,
        public EV:string,
        public isRealTimeMarket: boolean){}

    static fromMarketAlertMessage(company:Company, config:MarketAlertConfig, message:MarketAlertMessage, isRealTimeMarket: boolean):MarketAlert {
        message.EV = message.EV.replace('pct', '%');

        let english:string = config.english.replace('[#]', message.EV);
        let arabic:string = config.arabic.replace('[#]', message.EV);

        return new MarketAlert(
            StringUtils.guid(),                    //id
            config.key,                            //key
            company.name,
            message.symbol,                        //symbol
            message.time,                          //time
            message.Type,                          //type
            english,                               //messageEnglish
            arabic,                                //messageArabic
            MarketAlert.typeToColor(message.Type), //color
            message.EV,                             //EV
            isRealTimeMarket                        //we need this variable in annotationDelayedFormatter to show annotation delayed icon in market alert


        );
    }

    public static typeToColor(type:string) {

        // MA lower case type (due to inconsistency in case in our system)
        switch(type.toLowerCase()) {
        case 'ag':
            return '#13BCFF';
        case 'dmax':
            return '#FF8800';
        case 'fcn':
            return '#FF0000';
        case 'fcp':
            return '#00CC00';
        case 'lo1m':
            return '#D311FF';
        case 'lo1w':
            return '#F69EDB';
        case 'lo1y':
            return '#D311FF';
        case 'lo2y':
            return '#7B1A69';
        case 'lo3m':
            return '#D311FF';
        case 'lo6m':
            return '#D311FF';
        case 'max':
            return '#FF8800';
        case 'min':
            return '#770E06';
        case 'st':
            return '#CCCC00';
        case 'umin':
            return '#770E06';
        case 'hi':
            return '#005700';
        case 'hi1m':
            return '#8CA77B';
        case 'hi1w':
            return '#95D34F';
        case 'hi1y':
            return '#8CA77B';
        case 'hi2y':
            return '#005700';
        case 'hi3m':
            return '#8CA77B';
        case 'hi6m':
            return '#8CA77B';
        case 'lo':
            return '#7B1A69';
        }

        Tc.error("unkonwn type " + type);

        return null;

    }

}
