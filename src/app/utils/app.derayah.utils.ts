// import {Tc} from 'tc-web-chart-lib';

export class AppDerayahUtils {

    static getSymbolWithMarketFromDerayah(derayahMarket:number, derayahSymbol:string):string{
        let market = AppDerayahUtils.getMarketAbbreviationFromDerayahMarket(derayahMarket);
        return `${derayahSymbol}.${market}`;
    }

    static getAllowedMarketsAbbreviations():string[]{
        return ["TAD"];
    }

    private static getMarketAbbreviationFromDerayahMarket(market:number):string{
        switch(market) {
            case 99:
            case 98:
            case 100:
                return 'TAD';
            default:
              return '';
                // Tc.error('Unknown derayah market ' + market);
        }
    }

}
