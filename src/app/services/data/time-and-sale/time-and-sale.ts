import {TimeAndSaleMessage} from "../../streaming/index";
import {Tc} from "../../../utils/index";
import {Company} from "../../loader/index";
import {MarketGridData} from '../../../components/shared/grid-box/market-box';

export class TimeAndSale implements MarketGridData {

    constructor(
        public id:string,
        public name:string,
        public symbol:string,
        public date:string,
        public time:string,
        public price:number,
        public volume:number,
        public amount:number,
        public direction:string,
        public contracts:number,
        public specialTrade:boolean,
        public state:string,
        public isRealTimeMarket: boolean){}

    static fromTimeAndSaleMessage(company:Company, message:TimeAndSaleMessage, isRealTimeMarket: boolean):TimeAndSale {

        if(!message.st) { // st message doesn't come with the index, so add it
            message.st = "no";
        }

        let timeAndSale = new TimeAndSale(
            message.id.toString(), //id
            company.name, //name
            message.symbol, //symbol
            message.date, //date
            message.time, //time
            +(message.last), //price
            +(message.lastvolume), //volume
            0, //amount
            message.direction, //direction
            +(message.split), //contracts
            (message.st)=='true', //specialTrade
            message.tradestate, //state,
            isRealTimeMarket
        );

        timeAndSale.amount = Tc._2digits(timeAndSale.volume * timeAndSale.price);

        return timeAndSale;

    }

}
