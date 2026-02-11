import {Tc} from './tc.utils';
import {MarketUtils} from './market.utils';

export class MathUtils {

    static roundToNearestStep(value: number, step: number) {
        value *= 1000;
        step *= 1000;
        let mod = value % step;
        let halfStep = step / 2.0;
        if (mod < halfStep) {
            return (value - mod) / 1000;
        } else {
            return (value - mod + step) / 1000;
        }
    }

    static roundAccordingMarket(value: number, symbol: string): number {
        var splitted = MarketUtils.splitSymbol(symbol);
        Tc.assert(splitted.length == 2, "fail to roundToRequiredDigits. Invalid symbol " + symbol);

        if(splitted[1] == "FRX") {
            return this._5digits(value);
        }
        else return this._3digits(value);
    }

    static _3digits(num:number):number {
        return Math.round(num * 1000) / 1000;
    }

    static _5digits(num:number):number {
        return Math.round(num * 100000) / 100000;
    }
}
