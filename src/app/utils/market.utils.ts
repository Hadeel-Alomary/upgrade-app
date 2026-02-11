import {Tc} from "./tc.utils";
import Moment = moment.Moment;

export class MarketUtils {

    static marketAbbr(symbol:string):string {
        let dotPosition:number = symbol.lastIndexOf('.');
        Tc.assert(dotPosition !== -1, "invalid symbol " + symbol);
        return symbol.substring(dotPosition + 1);
    }

    static symbolWithoutMarket(symbol:string):string {
        let segments:string[] = MarketUtils.splitSymbol(symbol);
        Tc.assert(segments.length == 2, "invalid symbol " + symbol);
        return segments[0];
    }

    private static marketsOpenCloseTime(): MarketsOpenCloseTime[] {
        let allMarkets: MarketsOpenCloseTime[] = [];
        allMarkets.push({name: 'ASE', openTime: moment('10:30:00', 'HH:mm:ss'), closeTime: moment('12:30:00', 'HH:mm:ss')});
        allMarkets.push({name: 'TAD', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('15:20:00', 'HH:mm:ss')});
        allMarkets.push({name: 'DFM', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('15:00:00', 'HH:mm:ss')});
        allMarkets.push({name: 'ADX', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('15:00:00', 'HH:mm:ss')});
        allMarkets.push({name: 'KSE', openTime: moment('09:00:00', 'HH:mm:ss'), closeTime: moment('12:45:00', 'HH:mm:ss')});
        allMarkets.push({name: 'DSM', openTime: moment('09:30:00', 'HH:mm:ss'), closeTime: moment('13:15:00', 'HH:mm:ss')});
        allMarkets.push({name: 'EGY', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('14:30:00', 'HH:mm:ss')});
        allMarkets.push({name: 'USA', openTime: moment('09:30:00', 'HH:mm:ss'), closeTime: moment('16:00:00', 'HH:mm:ss')});
        allMarkets.push({name: 'FRX', openTime: moment('00:00:00', 'HH:mm:ss'), closeTime: moment('23:59:00', 'HH:mm:ss')});

        return allMarkets;
    }

    public static getMarketOpenCloseTime(marketAbbr:string) {
        return this.marketsOpenCloseTime().find(market => market.name == marketAbbr);
    }

    public static GetShiftHour(marketAbbr: string, time: Moment) {
        if (marketAbbr !== 'FRX')
            return 0;

        let daylightSavingTime = this.getForexDaylightSavingTimeRange(time.year());
        if (time.isBetween(daylightSavingTime.start , daylightSavingTime.end))
            return 3;

        return 2;
    }

    private static forexDayLightSavingRangeCache:{[key:number]:DaylightSavingTimeRage} = {};
    private static getForexDaylightSavingTimeRange(year:number):DaylightSavingTimeRage {
        if(!this.forexDayLightSavingRangeCache[year]) {
            let timeRange = {
                // Abu5 hack to determine if the day is in daylight saving
                // Most of the United States begins Daylight Saving Time at 2:00 a.m. on the second Sunday in March and reverts to standard time on the first Sunday in November.
                start: moment(this.nthDayOfMonth(moment(`${year}-03-01`), 7, 2)),
                end: moment(this.nthDayOfMonth(moment(`${year}-11-01`), 7, 1))
            };
            this.forexDayLightSavingRangeCache[year] = timeRange;
        }
        return this.forexDayLightSavingRangeCache[year];
    }

    //https://stackoverflow.com/questions/60023469/how-to-get-second-week-of-sunday-for-every-month-using-momentjs
    private static nthDayOfMonth(time:Moment, day:number, weekNumber:number):string  {
        let m = time.clone()
            .startOf('month')
            .day(day);
        if (m.month() !== time.month()) m.add(7, 'd');
        return m.add(7 * (weekNumber - 1), 'd').format('YYYY-MM-DD')
    }

    static splitTopic(topic: string): string[] {
        let indexOfFirstDot = topic.indexOf('.');
        let indexOfLastDot = topic.lastIndexOf('.');

        let firstWord = topic.substr(0, indexOfFirstDot);
        let secondWord = topic.substr(indexOfFirstDot + 1, indexOfLastDot - (firstWord.length + 1));
        let lastWord = topic.substr(indexOfLastDot + 1);

        return [firstWord, secondWord, lastWord];
    }

    static splitSymbol(symbol: string): string[] {
        let indexOfLastDot = symbol.lastIndexOf('.');

        let firstWord = symbol.substr(0, indexOfLastDot);
        let secondWord = symbol.substr(indexOfLastDot + 1);


        return [firstWord, secondWord];
    }

}

export interface MarketsOpenCloseTime {
    name:string,
    openTime:Moment,
    closeTime:Moment,
}

export interface DaylightSavingTimeRage {
    start:Moment,
    end:Moment
}
