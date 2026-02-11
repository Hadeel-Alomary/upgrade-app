export class AlertTrigger {
    constructor(
        public type: AlertTriggerType,
        public arabic: string,
        public english: string
    ) {
    }

    private static trendLineAlertTriggers: AlertTrigger[] = [];
    private static chartAlertTriggers: AlertTrigger[] = [];

    public static getTrendLineAlertTriggers(): AlertTrigger[] {
        if (AlertTrigger.trendLineAlertTriggers.length == 0) {
            AlertTrigger.trendLineAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE, 'عند الاختراق', 'On cross'));
            AlertTrigger.trendLineAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE_ON_CANDLE_CLOSE, 'عند الاختراق مع إغلاق الشمعة', 'On cross with candle close'));
        }
        return AlertTrigger.trendLineAlertTriggers;
    }

    public static getChartAlertTriggers(): AlertTrigger[] {
        if (AlertTrigger.chartAlertTriggers.length == 0) {
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE, 'مرة واحدة', 'Once'));
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE_ON_CANDLE_CLOSE, 'مرة واحدة عند إغلاق الشمعة', 'Once on candle close'));
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.EVERY_CANDLE, 'مرة لكل شمعة', 'Every candle'));
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.EVERY_CANDLE_CLOSE, 'عند إغلاق كل شمعة', 'Every candle close'));
        }
        return AlertTrigger.chartAlertTriggers;
    }
}

export enum AlertTriggerType {
    ONCE = 1,
    ONCE_ON_CANDLE_CLOSE,
    EVERY_CANDLE,
    EVERY_CANDLE_CLOSE
}
