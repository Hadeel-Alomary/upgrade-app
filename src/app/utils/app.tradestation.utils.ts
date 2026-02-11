export class AppTradestationUtils {

    static getSymbolWithMarketFromTradestation(TradestationSymbol:string):string{
        return `${TradestationSymbol}.USA`;
    }

    static getAllowedMarketsAbbreviations():string[]{
        return ["USA"];
    }

}
