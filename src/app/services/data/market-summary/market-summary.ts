export class MarketSummary {
    constructor(
        public market:string,
        public date:string,
        public time:string,
        public trades:number,
        public volume:number,
        public amount:number,
        public change:number,
        public percentChange:number,
        public index:number,
        public liquidity:number,
        public status:string,
        public traded:number,
        public advanced:number,
        public declined:number,
        public nochange:number){}    
}

export const MarketSummaryStatus = {
    PRE_OPEN: "pre open",
    OPEN : "open",
    PRE_CLOSE: "pre close",
    CLOSED: "closed",
    CLOSING_AUCTION: "closing auction",
    TRADE_AT_LAST: "trade at last"
};
