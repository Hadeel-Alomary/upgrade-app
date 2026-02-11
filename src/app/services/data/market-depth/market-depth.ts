import {MarketDepthMessage} from "../../streaming/index";
import {Tc, StringUtils} from "../../../utils/index";

import uniq from 'lodash/uniq';
import map from 'lodash/map';

// const uniq = require("lodash/uniq");
// const map = require("lodash/map");

export interface MarketDepthEntry {
    [key: string]: string | number,
    id:string,
    bidPriceLevel:number,
    bidOrders:number,
    bidPrice:number,
    bidQuantity:number,
    bidWeight:number,
    askPriceLevel:number,
    askOrders:number,
    askPrice:number,
    askQuantity:number,
    askWeight:number,
}

export class MarketDepth {

    symbol:string;
    groupedByPrice:boolean;
    entries:MarketDepthEntry[];

    constructor(symbol:string, groupedByPrice:boolean){
        this.symbol = symbol;
        this.groupedByPrice = groupedByPrice;
        this.entries = [];
    }

    static fromMarketDepthMessage(message:MarketDepthMessage, maxDepthRows:number){
        let marketDepth = new MarketDepth(message.symbol, message.groupedByPrice);
        MarketDepth.update(marketDepth, message, maxDepthRows);
        return marketDepth;
    }

    static update(marketDepth:MarketDepth, message:MarketDepthMessage, maxDepthRows:number){

        for(let rowNumber:number = 1; rowNumber <= maxDepthRows; ++rowNumber){
            // Ask
            if(message[`pa${rowNumber}`]){
                MarketDepth.getEntry(marketDepth, rowNumber).askPrice = +message[`pa${rowNumber}`];
            }
            if(message[`qa${rowNumber}`]){
                MarketDepth.getEntry(marketDepth, rowNumber).askQuantity = +message[`qa${rowNumber}`];
            }
            if(message[`na${rowNumber}`]){
                MarketDepth.getEntry(marketDepth, rowNumber).askOrders = +message[`na${rowNumber}`];
            }

            // Bid
            if(message[`pb${rowNumber}`]){
                MarketDepth.getEntry(marketDepth, rowNumber).bidPrice = +message[`pb${rowNumber}`];
            }
            if(message[`qb${rowNumber}`]){
                MarketDepth.getEntry(marketDepth, rowNumber).bidQuantity = +message[`qb${rowNumber}`];
            }
            if(message[`nb${rowNumber}`]){
                MarketDepth.getEntry(marketDepth, rowNumber).bidOrders = +message[`nb${rowNumber}`];
            }
        }

        // MA price levels are used to group entries with similar prices, and is used to color background
        // of market depth
        MarketDepth.updatePriceLevels(marketDepth);

        // MA quantity weight is used to draw the weight bar in market depth
        MarketDepth.updateQuantityWeight(marketDepth);

    }

    private static updatePriceLevels(marketDepth:MarketDepth) {
        this.updateLimitOrderPriceLevels(marketDepth);
        this.updateMarketOrdersPriceLevels(marketDepth);
    }

    private static updateLimitOrderPriceLevels(marketDepth:MarketDepth) {

        let bidPrices:number[] = uniq(<number[]> map(marketDepth.entries, 'bidPrice'));
        let askPrices:number[] = uniq(<number[]> map(marketDepth.entries, 'askPrice'));

        marketDepth.entries.forEach(entry => {
            entry.bidPriceLevel = bidPrices.indexOf(entry.bidPrice);
            entry.askPriceLevel = askPrices.indexOf(entry.askPrice);
        });

    }

    private static updateMarketOrdersPriceLevels(marketDepth:MarketDepth) {
        marketDepth.entries.forEach(entry => {
            let marketBidOrder: boolean = isNaN(entry.bidPrice) && !isNaN(entry.bidQuantity);
            let marketAskOrder: boolean = isNaN(entry.askPrice) && !isNaN(entry.askQuantity);

            //NK it's market order that happens when the market on "close auction" state
            //Update the level to fix the coloring on the market depth
            if (marketBidOrder) {
                entry.bidPriceLevel = 0;
            }

            if (marketAskOrder) {
                entry.askPriceLevel = 0;
            }
        });
    }

    private static updateQuantityWeight(marketDepth:MarketDepth) {

        let bidMaxQuantity:number, askMaxQuantity:number;

        marketDepth.entries.forEach(entry => {
            if(!isNaN(entry['bidQuantity'])){
                bidMaxQuantity = (!bidMaxQuantity || bidMaxQuantity < entry['bidQuantity']) ? entry['bidQuantity'] : bidMaxQuantity;
            }
            if(!isNaN(entry['askQuantity'])){
                askMaxQuantity = (!askMaxQuantity || askMaxQuantity < entry['askQuantity']) ? entry['askQuantity'] : askMaxQuantity;
            }
        });

        let maxQuantity:number = Math.max(bidMaxQuantity, askMaxQuantity);

        marketDepth.entries.forEach(entry => {
            entry.bidWeight = Math.round( (entry.bidQuantity * 100) / maxQuantity );
            entry.askWeight = Math.round( (entry.askQuantity * 100) / maxQuantity );
        });

    }

    private static getEntry(marketDepth:MarketDepth, rowNumber:number){

        let index:number = rowNumber - 1;

        Tc.assert(0 <= index, "index cannot be negative");

        if(!marketDepth.entries[index]){
            marketDepth.entries[index] = {id:StringUtils.guid(),
                                          bidOrders:0, bidQuantity:0, bidPrice:0, bidPriceLevel: 0, bidWeight: 0,
                                          askOrders:0, askQuantity:0, askPrice:0, askPriceLevel: 0, askWeight: 0};
        }

        return marketDepth.entries[index];

    }



}

export interface MarketDepths {
    [symbol:string]: MarketDepth
}
