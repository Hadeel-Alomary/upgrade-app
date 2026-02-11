import {Company} from '../../loader/loader';
import {MarketAlertMessage, TechnicalScopeMessage} from '../../streaming/shared';
import {StringUtils, Tc} from '../../../utils';
import {LanguageService} from '../../state';

export class TechnicalScopeSignal {

    private static technicalScopeStrategies: TechnicalScopeStrategy;

    private constructor(
        public id: string,
        public name: string,
        public symbol: string,
        public time: string,
        public signal: string,
        public topic: string,
        public arabicMessage: string,
        public englishMessage: string,
        public signalState: TechnicalScopeStateType,
        public color: string,
        public isRealTimeMarket: boolean
    ) {
    }

    static formatTechnicalScopeSignal(company: Company, message: TechnicalScopeMessage, isRealTimeMarket: boolean): TechnicalScopeSignal {
        let newState: TechnicalSignalState = TechnicalScopeSignal.evalTechnicalSignalState(message.signal, message.value);
        let newColor: string = TechnicalScopeSignal.getSignalColor(newState.state);
        return new TechnicalScopeSignal(
            StringUtils.guid(),           //id
            company.name,                 //name
            message.symbol,               //symbol
            message.date.split(' ')[1],   //time
            message.signal,               //signal
            message.topic,                //topic
            newState.arabic,
            newState.english,
            newState.state,
            newColor,
            isRealTimeMarket
        );
    }

    public static evalTechnicalSignalState(signal: string, value: string): TechnicalSignalState {
        let message: string = `${signal}(${value})`;
        switch (message) {
            case 'cross-ma-10-25(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك البسيط 10 مع 25',
                    english: 'Positive Cross for Simple Moving Average 10 with 25',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ma-10-25(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك البسيط 10 مع 25',
                    english: 'Negative Cross for Simple Moving Average 10 with 25',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ema-10-25(1.0)':
                return {
                    arabic:'تقاطع ايجابي للمتوسط المتحرك الأسي 10 مع 25',
                    english: 'Positive Cross for Exponential Moving Average 10 with 25',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ema-10-25(-1.0)':
                return {
                    arabic:'تقاطع سلبي للمتوسط المتحرك الأسي 10 مع 25',
                    english: 'Negative Cross for Exponential Moving Average 10 with 25',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ma-10-50(1.0)':
                return {
                    arabic:'تقاطع ايجابي للمتوسط المتحرك البسيط 10 مع 50',
                    english: 'Positive Cross for Simple Moving Average 10 with 50',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ma-10-50(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك البسيط 10 مع 50',
                    english: 'Negative Cross for Simple Moving Average 10 with 50',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ema-10-50(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك الأسي 10 مع 50',
                    english: 'Positive Cross for Exponential Moving Average 10 with 50',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ema-10-50(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك الأسي 10 مع 50',
                    english: 'Negative Cross for Exponential Moving Average 10 with 50',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ma-10-100(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك البسيط 10 مع 100',
                    english: 'Positive Cross for Simple Moving Average 10 with 100',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ma-10-100(-1.0)':
                return {
                    arabic :'تقاطع سلبي للمتوسط المتحرك البسيط 10 مع 100',
                    english: 'Negative Cross for Simple Moving Average 10 with 100',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ema-10-100(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك الأسي 10 مع 100',
                    english: 'Positive Cross for Exponential Moving Average 10 with 100',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ema-10-100(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك الأسي 10 مع 100',
                    english: 'Negative Cross for Exponential Moving Average 10 with 100',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ma-25-50(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك البسيط 25 مع 50',
                    english: 'Positive Cross for Simple Moving Average 25 with 50',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ma-25-50(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك البسيط 25 مع 50',
                    english: 'Negative Cross for Simple Moving Average 25 with 50',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ema-25-50(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك الأسي 25 مع 50',
                    english: 'Positive Cross for Exponential Moving Average 25 with 50',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ema-25-50(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك الأسي 25 مع 50',
                    english: 'Negative Cross for Exponential Moving Average 25 with 50',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ma-25-100(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك البسيط 25 مع 100',
                    english: 'Positive Cross for Simple Moving Average 25 with 100',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ma-25-100(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك البسيط 25 مع 100',
                    english: 'Negative Cross for Simple Moving Average 25 with 100',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ema-25-100(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك الأسي 25 مع 100',
                    english: 'Positive Cross for Exponential Moving Average 25 with 100',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ema-25-100(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك الأسي 25 مع 100',
                    english: 'Negative Cross for Exponential Moving Average 25 with 100',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ma-50-100(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك البسيط 50 مع 100',
                    english: 'Positive Cross for Simple Moving Average 50 with 100',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ma-50-100(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك البسيط 50 مع 100',
                    english: 'Negative Cross for Simple Moving Average 50 with 100',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-ema-50-100(1.0)':
                return {
                    arabic: 'تقاطع ايجابي للمتوسط المتحرك الأسي 50 مع 100',
                    english: 'Positive Cross for Exponential Moving Average 50 with 100',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-ema-50-100(-1.0)':
                return {
                    arabic: 'تقاطع سلبي للمتوسط المتحرك الأسي 50 مع 100',
                    english: 'Negative Cross for Exponential Moving Average 50 with 100',
                    state: TechnicalScopeStateType.negative
                }
            case 'aroonup(1.0)':
                return {
                    arabic: 'اختراق Aroon Up لمستوى 50 صعوداً',
                    english: 'Aroon Up Breaks Level 50 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'aroonup(-1.0)':
                return {
                    arabic: 'اختراق Aroon Up لمستوى 50 هبوطاُ',
                    english: 'Aroon Up Breaks Level 50 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'aroondown(1.0)':
                return {
                    arabic: 'اختراق Aroon Down لمستوى 50 صعوداً',
                    english: 'Aroon Down Breaks Level 50 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'aroondown(-1.0)':
                return {
                    arabic: 'اختراق Aroon Down لمستوى 50 هبوطاُ',
                    english: 'Aroon Down Breaks Level 50 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'macd(1.0)':
                return {
                    arabic: 'اختراق MACD لمستوى 0 صعوداً',
                    english: 'MACD Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'macd(-1.0)':
                return {
                    arabic: 'اختراق MACD لمستوى 0 هبوطاُ',
                    english: 'MACD Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'macdsignal(1.0)':
                return {
                    arabic: 'اختراق MACD Signal لمستوى 0 صعوداً',
                    english: 'MACD Signal Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'macdsignal(-1.0)':
                return {
                    arabic: 'اختراق MACD Signal لمستوى 0 هبوطاُ',
                    english: 'MACD Signal Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'macdh(1.0)':
                return {
                    arabic: 'اختراق MACD-H لمستوى 0 صعوداً',
                    english: 'MACD-H Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'macdh(-1.0)':
                return {
                    arabic: 'اختراق MACD-H لمستوى 0 هبوطاُ',
                    english: 'MACD-H Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'cmf(1.0)':
                return {
                    arabic: 'اختراق CMF لمستوى 0 صعوداً',
                    english: 'CMF Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'cmf(-1.0)':
                return {
                    arabic: 'اختراق CMF لمستوى 0 هبوطاُ',
                    english: 'CMF Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'sar(1.0)':
                return {
                    arabic: 'Parabolic SAR انعكاس ايجابي',
                    english: 'Parabolic SAR Positive Reflection',
                    state: TechnicalScopeStateType.positive
                }
            case 'sar(-1.0)':
                return {
                    arabic: 'Parabolic SAR انعكاس سلبي',
                    english: 'Parabolic SAR Negative Reflection',
                    state: TechnicalScopeStateType.negative
                }
            case 'ppo(1.0)':
                return {
                    arabic: 'اختراق Price Oscillator لمستوى 0 صعوداً',
                    english: 'Price Oscillator Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'ppo(-1.0)':
                return {
                    arabic: 'اختراق Price Oscillator لمستوى 0 هبوطاُ',
                    english: 'Price Oscillator Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'roc(1.0)':
                return {
                    arabic: 'اختراق ROC لمستوى 0 صعوداً',
                    english: 'ROC Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'roc(-1.0)':
                return {
                    arabic: 'اختراق ROC لمستوى 0 هبوطاُ',
                    english: 'ROC Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'eom(1.0)':
                return {
                    arabic: 'اختراق EOM لمستوى 0 صعوداً',
                    english: 'EOM Breaks Level 0 Upward',
                    state: TechnicalScopeStateType.positive
                }
            case 'eom(-1.0)':
                return {
                    arabic: 'اختراق EOM لمستوى 0 هبوطاُ',
                    english: 'EOM Breaks Level 0 Downward',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-macd(1.0)':
                return {
                    arabic: 'MACD - تقاطع ايجابي MACD مع MACD Signal',
                    english: 'MACD - Positive Cross for MACD with MACD Signal',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-macd(-1.0)':
                return {
                    arabic: 'MACD - تقاطع سلبي MACD مع MACD Signal',
                    english: 'MACD - Negative Cross for MACD with MACD Signal',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-stok(1.0)':
                return {
                    arabic: 'Stochastic - تقاطع ايجابي K مع D',
                    english: 'Stochastic - Positive Cross for K with D',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-stok(-1.0)':
                return {
                    arabic: 'Stochastic - تقاطع سلبي K مع D',
                    english: 'Stochastic - Negative Cross for K with D',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-aroon(1.0)':
                return {
                    arabic: 'Aroon - تقاطع ايجابي Up مع Down',
                    english: 'Aroon - Positve Cross for Up with Down',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-aroon(-1.0)':
                return {
                    arabic: 'Aroon - تقاطع سلبي Up مع Down',
                    english: 'Aroon - Negative Cross for Up with Down',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-pdi-mdi(1.0)':
                return {
                    arabic: 'ADX - تقاطع ايجابي +DI مع -DI',
                    english: 'ADX - Positive Cross for +DI with -DI',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-pdi-mdi(-1.0)':
                return {
                    arabic: 'ADX - تقاطع سلبي +DI مع -DI',
                    english: 'ADX - Negative Cross for +DI with -DI',
                    state: TechnicalScopeStateType.negative
                }
            case 'cloud-new(1.0)':
                return {
                    arabic: 'ايشيموكو - غيمة خضراء جديدة',
                    english: 'Ichimoku - New Green Cluod',
                    state: TechnicalScopeStateType.positive
                }
            case 'cloud-new(-1.0)':
                return {
                    arabic: 'ايشيموكو - غيمة حمراء جديدة',
                    english: 'Ichimoku - New Red Cloud',
                    state: TechnicalScopeStateType.negative
                }
            case 'cloud-cross(1.0)':
                return {
                    arabic: 'ايشيموكو - اختراق ايجابي للسعر مع الغيمة',
                    english: 'Ichimoku - Positive Break for Price with Cloud',
                    state: TechnicalScopeStateType.positive
                }
            case 'cloud-cross(-1.0)':
                return {
                    arabic: 'ايشيموكو - اختراق سلبي للسعر مع الغيمة',
                    english: 'Ichimoku - Negative Break for Price with Cloud',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-price-kij(1.0)':
                return {
                    arabic: 'ايشيموكو  - تقاطع ايجابي السعر مع KIJUNSEN',
                    english: 'Ichimoku - Positive Cross for Price with KIJUNSEN',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-price-kij(-1.0)':
                return {
                    arabic: 'ايشيموكو  - تقاطع سلبي السعر مع KIJUNSEN',
                    english: 'Ichimoku - Negative Cross for Price with KIJUNSEN',
                    state: TechnicalScopeStateType.negative
                }
            case 'cross-tnk-kij(1.0)':
                return {
                    arabic: 'ايشيموكو  - تقاطع ايجابي TENKANSEN مع KIJUNSEN',
                    english: 'Ichimoku - Positive Cross for TENKANSEN with KIJUNSEN',
                    state: TechnicalScopeStateType.positive
                }
            case 'cross-tnk-kij(-1.0)':
                return {
                    arabic: 'ايشيموكو  - تقاطع سلبي TENKANSEN مع KIJUNSEN',
                    english: 'Ichimoku - Negative Cross for TENKANSEN with KIJUNSEN',
                    state: TechnicalScopeStateType.negative
                }
            case 'price-gap(1.0)':
                return {
                    arabic: 'فجوة سعرية للأعلى',
                    english: 'Price Up Gap',
                    state: TechnicalScopeStateType.positive
                }
            case 'price-gap(-1.0)':
                return {
                    arabic: 'فجوة سعرية للأسفل',
                    english: 'Price Down Gap',
                    state: TechnicalScopeStateType.negative
                }
            case 'rsi-level(1.0)':
                return {
                    arabic: 'RSI - دخول في منطقة تشبع الشراء',
                    english: 'RSI - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'rsi-level(2.0)':
                return {
                    arabic: 'RSI - خروج من منطقة تشبع الشراء',
                    english: 'RSI - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'rsi-level(3.0)':
                return {
                    arabic: 'RSI - دخول في منطقة تشبع البيع',
                    english: 'RSI - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'rsi-level(4.0)':
                return {
                    arabic: 'RSI - خروج من منطقة تشبع البيع',
                    english: 'RSI - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'stod-level(1.0)':
                return {
                    arabic: 'Stochastic D - دخول في منطقة تشبع الشراء',
                    english: 'Stochastic D - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'stod-level(2.0)':
                return {
                    arabic: 'Stochastic D - خروج من منطقة تشبع الشراء',
                    english: 'Stochastic D - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'stod-level(3.0)':
                return {
                    arabic: 'Stochastic D - دخول في منطقة تشبع البيع',
                    english: 'Stochastic D - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'stod-level(4.0)':
                return {
                    arabic: 'Stochastic D - خروج من منطقة تشبع البيع',
                    english: 'Stochastic D - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'stok-level(1.0)':
                return {
                    arabic: 'Stochastic K - دخول في منطقة تشبع الشراء',
                    english: 'Stochastic K - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'stok-level(2.0)':
                return {
                    arabic: 'Stochastic K - خروج من منطقة تشبع الشراء',
                    english: 'Stochastic K - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'stok-level(3.0)':
                return {
                    arabic: 'Stochastic K - دخول في منطقة تشبع البيع',
                    english: 'Stochastic K - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'stok-level(4.0)':
                return {
                    arabic: 'Stochastic K - خروج من منطقة تشبع البيع',
                    english: 'Stochastic K - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'stochrsi-level(1.0)':
                return {
                    arabic: 'StochasticRSI - دخول في منطقة تشبع الشراء',
                    english: 'StochasticRSI - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'stochrsi-level(2.0)':
                return {
                    arabic: 'StochasticRSI - خروج من منطقة تشبع الشراء',
                    english: 'StochasticRSI - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'stochrsi-level(3.0)':
                return {
                    arabic: 'StochasticRSI - دخول في منطقة تشبع البيع',
                    english: 'StochasticRSI - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'stochrsi-level(4.0)':
                return {
                    arabic: 'StochasticRSI- خروج من منطقة تشبع البيع',
                    english: 'StochasticRSI - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'cci-level(1.0)':
                return {
                    arabic: 'CCI - دخول في منطقة تشبع الشراء',
                    english: 'CCI - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'cci-level(2.0)':
                return {
                    arabic: 'CCI - خروج من منطقة تشبع الشراء',
                    english: 'CCI - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'cci-level(3.0)':
                return {
                    arabic: 'CCI - دخول في منطقة تشبع البيع',
                    english: 'CCI - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'cci-level(4.0)':
                return {
                    arabic: 'CCI - خروج من منطقة تشبع البيع',
                    english: 'CCI - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'mfi-level(1.0)':
                return {
                    arabic: 'MFI - دخول في منطقة تشبع الشراء',
                    english: 'MFI - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'mfi-level(2.0)':
                return {
                    arabic: 'MFI - خروج من منطقة تشبع الشراء',
                    english: 'MFI - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'mfi-level(3.0)':
                return {
                    arabic: 'MFI - دخول في منطقة تشبع البيع',
                    english: 'MFI - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'mfi-level(4.0)':
                return {
                    arabic: 'MFI - خروج من منطقة تشبع البيع',
                    english: 'MFI - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'wr-level(1.0)':
                return {
                    arabic: 'Williams %R - دخول في منطقة تشبع الشراء',
                    english: 'Williams %R - Enter to OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'wr-level(2.0)':
                return {
                    arabic: 'Williams %R - خروج من منطقة تشبع الشراء',
                    english: 'Williams %R - Exit from OverBought area',
                    state: TechnicalScopeStateType.negative
                }
            case 'wr-level(3.0)':
                return {
                    arabic: 'Williams %R - دخول في منطقة تشبع البيع',
                    english: 'Williams %R - Enter to OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            case 'wr-level(4.0)':
                return {
                    arabic: 'Williams %R - خروج من منطقة تشبع البيع',
                    english: 'Williams %R - Exit from OverSold area',
                    state: TechnicalScopeStateType.positive
                }
            default:
                Tc.assert(false,"UnKnown Signal");
                return null;
        }
    }

    private static getSignalColor(technicalScopeState: TechnicalScopeStateType): string {
        switch (technicalScopeState) {
            case TechnicalScopeStateType.positive:
                return '#00CC00';
            case TechnicalScopeStateType.negative:
                return '#F00000';
            default:
                Tc.error('unknown state');
        }
    }

    public static getTechnicalScopeStrategies():  TechnicalScopeStrategy {
        if(!TechnicalScopeSignal.technicalScopeStrategies) {
            TechnicalScopeSignal.buildTechnicalScopeStrategies();
        }
        return TechnicalScopeSignal.technicalScopeStrategies;
    }

    private static buildTechnicalScopeStrategies():  TechnicalScopeStrategy {
        TechnicalScopeSignal.technicalScopeStrategies = {};

        TechnicalScopeSignal.technicalScopeStrategies['cross-ma-10-25'] = {
            key: 'cross-ma-10-25',
            arabic: 'تقاطع المتوسط المتحرك البسيط 10 مع 25',
            english: 'Simple Moving Average 10 cross 25',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ema-10-25'] = {
            key: 'cross-ema-10-25',
            arabic: 'تقاطع المتوسط المتحرك الأسي 10 مع 25',
            english: 'Exponential Moving Average 10 cross 25',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ma-10-50'] = {
            key: 'cross-ma-10-50',
            arabic: 'تقاطع المتوسط المتحرك البسيط 10 مع 50',
            english: 'Simple Moving Average 10 cross 50',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ema-10-50'] = {
            key: 'cross-ema-10-50',
            arabic: 'تقاطع المتوسط المتحرك الأسي 10 مع 50',
            english: 'Exponential Moving Average 10 cross 50',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ma-10-100'] = {
            key: 'cross-ma-10-100',
            arabic: 'تقاطع المتوسط المتحرك البسيط 10 مع 100',
            english: 'Simple Moving Average 10 cross 100',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ema-10-100'] = {
            key: 'cross-ema-10-100',
            arabic: 'تقاطع المتوسط المتحرك الأسي 10 مع 100',
            english: 'Exponential Moving Average 10 cross 100',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ma-25-50'] = {
            key: 'cross-ma-25-50',
            arabic: 'تقاطع المتوسط المتحرك البسيط 25 مع 50',
            english: 'Simple Moving Average 25 cross 50',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ema-25-50'] = {
            key: 'cross-ema-25-50',
            arabic: 'تقاطع المتوسط المتحرك الأسي 25 مع 50',
            english: 'Exponential Moving Average 25 cross 50',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ma-25-100'] = {
            key: 'cross-ma-25-100',
            arabic: 'تقاطع المتوسط المتحرك البسيط 25 مع 100',
            english: 'Simple Moving Average 25 cross 100',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ema-25-100'] = {
            key: 'cross-ema-25-100',
            arabic: 'تقاطع المتوسط المتحرك الأسي 25 مع 100',
            english: 'Exponential Moving Average 25 cross 100',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ma-50-100'] = {
            key: 'cross-ma-50-100',
            arabic: 'تقاطع المتوسط المتحرك البسيط 50 مع 100',
            english: 'Simple Moving Average 50 cross 100',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-ema-50-100'] = {
            key: 'cross-ema-50-100',
            arabic: 'تقاطع المتوسط المتحرك الأسي 50 مع 100',
            english: 'Exponential Moving Average 50 cross 100',
            category: TechnicalScopeCategoryType.MA_EMA_CROSS
        };

        TechnicalScopeSignal.technicalScopeStrategies['aroonup'] = {
            key: 'aroonup',
            arabic: 'اختراق Aroon Up لمستوى 50',
            english: 'Aroon Up Breaks Level 50',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['aroondown'] = {
            key: 'aroondown',
            arabic: 'اختراق Aroon Down لمستوى 50',
            english: 'Aroon Down Breaks Level 50',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['macd'] = {
            key: 'macd',
            arabic: 'اختراق MACD لمستوى 0',
            english: 'MACD Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['macdsignal'] = {
            key: 'macdsignal',
            arabic: 'اختراق MACD Signal لمستوى 0',
            english: 'MACD Signal Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['macdh'] = {
            key: 'macdh',
            arabic: 'اختراق MACD-H لمستوى 0',
            english: 'MACD-H Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['sar'] = {
            key: 'sar',
            arabic: 'انعكاس Parabolic SAR',
            english: 'Parabolic SAR Reflection',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cmf'] = {
            key: 'cmf',
            arabic: 'اختراق CMF لمستوى 0',
            english: 'CMF Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['ppo'] = {
            key: 'ppo',
            arabic: 'اختراق Price Oscillator لمستوى 0',
            english: 'Price Oscillator Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['roc'] = {
            key: 'roc',
            arabic: 'اختراق ROC لمستوى 0',
            english: 'ROC Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };
        TechnicalScopeSignal.technicalScopeStrategies['eom'] = {
            key: 'eom',
            arabic: 'اختراق EOM لمستوى 0',
            english: 'EOM Breaks Level 0',
            category: TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS
        };

        TechnicalScopeSignal.technicalScopeStrategies['cross-macd'] = {
            key: 'cross-macd',
            arabic: 'MACD - تقاطع  MACD مع MACD Signal',
            english: 'MACD - Cross MACD MACD Signal',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-stok'] = {
            key: 'cross-stok',
            arabic: 'Stochastic - تقاطع  K مع D',
            english: 'Stochastic - K Cross D',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-aroon'] = {
            key: 'cross-aroon',
            arabic: 'Aroon - تقاطع  Up مع Down',
            english: 'Aroon - Up Cross Down',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-pdi-mdi'] = {
            key: 'cross-pdi-mdi',
            arabic: 'ADX - تقاطع  +DI مع -DI',
            english: 'ADX - +DI Cross -DI',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cloud-new'] = {
            key: 'cloud-new',
            arabic: 'ايشيموكو - غيمة جديدة',
            english: 'Ichimoku - New Cluod',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cloud-cross'] = {
            key: 'cloud-cross',
            arabic: 'ايشيموكو - اختراق السعر مع الغيمة',
            english: 'Ichimoku - Price Break Cloud',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-price-kij'] = {
            key: 'cross-price-kij',
            arabic: 'ايشيموكو  - تقاطع السعر مع KIJUNSEN',
            english: 'Ichimoku - Price Cross KIJUNSEN',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['cross-tnk-kij'] = {
            key: 'cross-tnk-kij',
            arabic: 'ايشيموكو  - تقاطع  TENKANSEN مع KIJUNSEN',
            english: 'Ichimoku - TENKANSEN Cross KIJUNSEN',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };
        TechnicalScopeSignal.technicalScopeStrategies['price-gap'] = {
            key: 'price-gap',
            arabic: 'قجوه سعرية',
            english: 'Price Gap',
            category: TechnicalScopeCategoryType.TECHNICAL_SIGNALS
        };

        TechnicalScopeSignal.technicalScopeStrategies['rsi-level'] = {
            key: 'rsi-level',
            arabic: 'RSI - تشبع الشراء و البيع',
            english: 'RSI - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };
        TechnicalScopeSignal.technicalScopeStrategies['stod-level'] = {
            key: 'stod-level',
            arabic: 'Stochastic D - تشبع الشراء و البيع',
            english: 'Stochastic D - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };
        TechnicalScopeSignal.technicalScopeStrategies['stok-level'] = {
            key: 'stok-level',
            arabic: 'Stochastic K - تشبع الشراء و البيع',
            english: 'Stochastic K - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };
        TechnicalScopeSignal.technicalScopeStrategies['stochrsi-level'] = {
            key: 'stochrsi-level',
            arabic: 'StochasticRSI - تشبع الشراء و البيع',
            english: 'StochasticRSI - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };
        TechnicalScopeSignal.technicalScopeStrategies['cci-level'] = {
            key: 'cci-level',
            arabic: 'CCI - تشبع الشراء و البيع',
            english: 'CCI - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };
        TechnicalScopeSignal.technicalScopeStrategies['mfi-level'] = {
            key: 'mfi-level',
            arabic: 'MFI - تشبع الشراء و البيع',
            english: 'MFI - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };
        TechnicalScopeSignal.technicalScopeStrategies['wr-level'] = {
            key: 'wr-level',
            arabic: 'Williams %R - تشبع الشراء و البيع',
            english: 'Williams %R - Over Bought-Sold',
            category: TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD
        };

        return TechnicalScopeSignal.technicalScopeStrategies;
      }
}

export interface TechnicalSignalState {
    arabic: string,
    english: string,
    state: TechnicalScopeStateType
}

export enum TechnicalScopeStateType {
    positive = 1,
    negative
}

interface TechnicalScopeStrategy {
  [key: string]: {
    key: string,
    arabic: string,
    english: string,
    category: TechnicalScopeCategoryType
  }
}

export enum TechnicalScopeCategoryType {
    MA_EMA_CROSS = 1,
    DIFFERENT_INDICATORS_CROSS,
    TECHNICAL_SIGNALS,
    OVER_BOUGHT_OVER_SOLD
}
