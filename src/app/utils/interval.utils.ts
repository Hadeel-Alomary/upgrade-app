// import {Interval} from '../components/chart/interval/interval';
// import {BaseIntervalType, IntervalType} from '../components/chart/interval/interval-type';
import {Tc} from './tc.utils';
import Moment = moment.Moment;
// import {TimeSpan} from '../stock-chart/StockChartX/Data/TimeFrame';
import {MarketUtils} from './market.utils';
import {DateUtils} from './date.utils';

export class IntervalUtils {

  //   public static getGroupingTime(marketAbbr:string, interval:Interval, time:string):string {
  //       let result:Moment = this.getGroupingMomentTime(marketAbbr, interval, moment(time));
  //       return Interval.isDaily(interval) ? result.format('YYYY-MM-DD') : result.format('YYYY-MM-DD HH:mm:ss');
  //   }
  //
  //   public static getGroupingMomentTime(marketAbbr:string, interval:Interval, time:Moment):Moment {
  //       return Interval.isDaily(interval) ?
  //           IntervalUtils.getDailyGroupingTime(marketAbbr, time, interval) :
  //           IntervalUtils.getIntraDayGroupingTime(marketAbbr, time, interval);
  //   }
  //
  //   private static getIntraDayGroupingTime(marketAbbr: string, time: Moment, interval: Interval): Moment {
  //       if (interval.type == IntervalType.Minute) {return time;} // no need for grouping
  //       // MA base is needed for markets that don't open at start of hour.
  //       // for example, if market opens at 10:30, then the base should be 30
  //       // If market opens at 10:45, then base should be 45 and such ...
  //       time = moment(time).add('-1', 'minutes');
  //       let marketStartTime = MarketUtils.getMarketOpenCloseTime(marketAbbr).openTime;
  //       let marketStartTimeTotalMinutes = marketStartTime.hour() * 60 + marketStartTime.minute();
  //       let timeTotalMinutes = (moment(time).add(MarketUtils.GetShiftHour(marketAbbr, time), 'hours')).hour() * 60 + time.minute();
  //       let minutesDiff = timeTotalMinutes - marketStartTimeTotalMinutes;
  //       let minutesDuration: number = Interval.getMinutesDuration(interval);
  //       let minutesToAdd: number =  minutesDuration - (minutesDiff % minutesDuration);
  //       let groupedTime = moment(time).add(minutesToAdd, 'minutes');
  //       return groupedTime;
  //   }
  //
  // private static getDailyGroupingTime(marketAbbr: string, time:Moment, interval:Interval):Moment {
  //   let momentInterval: moment.unitOfTime.StartOf;
  //   switch (interval.type) {
  //     case IntervalType.Day:
  //       momentInterval = 'day';
  //       return time.startOf(momentInterval);
  //     case IntervalType.Week:
  //       momentInterval = 'week';
  //       return time.startOf(momentInterval);
  //     case IntervalType.Month:
  //       momentInterval = 'month';
  //       return time.startOf(momentInterval);
  //     case IntervalType.Quarter:
  //       momentInterval = 'quarter';
  //       return time.startOf(momentInterval);
  //     case IntervalType.Year:
  //       momentInterval = 'year';
  //       return time.startOf(momentInterval);
  //     case IntervalType.Custom:
  //       let OAdate = this.getOaDateTime(time);
  //       let subtractDays = 0;
  //       switch (interval.base) {
  //         case BaseIntervalType.Day:
  //           subtractDays = (OAdate % interval.repeat);
  //           let startDate = time.startOf('day').add(-subtractDays, 'day');
  //           while (!DateUtils.isBusinessDay(marketAbbr, startDate.toDate())) {
  //             startDate = startDate.add(1, 'day');
  //           }
  //           return startDate;
  //         case BaseIntervalType.Week:
  //           subtractDays = (OAdate % ((interval.repeat) * 7));
  //           let startWeek = time.add(-subtractDays, 'day');
  //           return startWeek.startOf('week').add(1, 'week');
  //         case BaseIntervalType.Month:
  //           let subtractMonths = ((time.year() * 12 + time.month()) % interval.repeat);
  //           return time.startOf('month').add(-subtractMonths, 'month');
  //       }
  //     default:
  //       Tc.error("unkown interval");
  //   }
  // }
  //
  //   public static  getOaDateTime(time: Moment): number {
  //     let timeString = time.format('YYYY-MM-DD');
  //     return (Date.parse(timeString + ' GMT') + (25569 * TimeSpan.MILLISECONDS_IN_DAY)) / TimeSpan.MILLISECONDS_IN_DAY;
  //   }

}
