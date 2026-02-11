import {Tc} from '../../../utils';

export class ChartAlertFunction {
    constructor(
        public type: ChartAlertFunctionType,
        public arabic: string,
        public english: string,
        public arabicMessageTemplate:string,
        public englishMessageTemplate:string,
        public technicalFunction:string
    ) {
    }

    private static allFunctions: ChartAlertFunction[] = [];

    public static getAllFunctions(): ChartAlertFunction[] {
        if (ChartAlertFunction.allFunctions.length == 0) {
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.CROSS, 'تقاطع', 'Cross',
                ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.CROSS), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.CROSS), TechnicalFunctions.CROSS));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.CROSS_UP, 'تقاطع للأعلى', 'Cross up',
                ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.CROSS_UP), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.CROSS_UP), TechnicalFunctions.CROSS_UP));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.CROSS_DOWN, 'تقاطع للأسفل', 'Cross down',
                ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.CROSS_DOWN), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.CROSS_DOWN), TechnicalFunctions.CROSS_DOWN));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.ENTERING_CHANNEL, 'دخول قناة', 'Entering channel',
                ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.ENTERING_CHANNEL), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.ENTERING_CHANNEL), TechnicalFunctions.ENTERING_CHANNEL));
            ChartAlertFunction.allFunctions.push(new ChartAlertFunction(ChartAlertFunctionType.EXITING_CHANNEL, 'خروج قناة', 'Exiting channel',
                ChartAlertFunction.getArabicMessage(ChartAlertFunctionType.EXITING_CHANNEL), ChartAlertFunction.getEnglishMessage(ChartAlertFunctionType.EXITING_CHANNEL), TechnicalFunctions.EXITING_CHANNEL));
        }
        return ChartAlertFunction.allFunctions;
    }

    public static fromType(type: ChartAlertFunctionType): ChartAlertFunction {
        let result = ChartAlertFunction.getAllFunctions().find(alertFunction => alertFunction.type == type);
        Tc.assert(result != null, 'Unsupported Chart Alert Function Type: ' + type);
        return result;
    }

    public static getArabicMessage(technicalFunctionType: ChartAlertFunctionType): string {
        switch(technicalFunctionType) {
            case ChartAlertFunctionType.CROSS:
                return 'INDICATOR يتقاطع مع قيمة VALUE1';
            case ChartAlertFunctionType.CROSS_UP:
                return 'INDICATOR يتقاطع لأعلى مع قيمة VALUE1';
            case ChartAlertFunctionType.CROSS_DOWN:
                return 'INDICATOR يتقاطع لأسفل مع قيمة VALUE1';
            case ChartAlertFunctionType.ENTERING_CHANNEL:
                return 'INDICATOR يدخل إلى قناة تتراوح من VALUE2 إلى VALUE1';
            case ChartAlertFunctionType.EXITING_CHANNEL:
                return 'INDICATOR يخرج من قناة تتراوح من VALUE2 إلى VALUE1';

        }
        Tc.error("should never be here");
    }

    public static getEnglishMessage(technicalFunctionType: ChartAlertFunctionType): string {
        switch(technicalFunctionType) {
            case ChartAlertFunctionType.CROSS:
                return 'INDICATOR crosses value VALUE1';
            case ChartAlertFunctionType.CROSS_DOWN:
                return 'INDICATOR crosses up value VALUE1';
            case ChartAlertFunctionType.CROSS_UP:
                return 'INDICATOR crosses down value VALUE1';
            case ChartAlertFunctionType.ENTERING_CHANNEL:
                return 'INDICATOR enters channel that ranges from VALUE1 to VALUE2';
            case ChartAlertFunctionType.EXITING_CHANNEL:
                return 'INDICATOR exits channel that ranges from VALUE1 to VALUE2';

        }
        Tc.error("should never be here");
    }

}


export enum ChartAlertFunctionType {
    CROSS = 1,
    CROSS_UP,
    CROSS_DOWN,
    ENTERING_CHANNEL,
    EXITING_CHANNEL
}

class TechnicalFunctions {
    public static CROSS: string = "((( P_1 > P_2 ) and (( P_1_prv1 < P_2_prv1 ) or (( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 < P_2_prv2 )))) or (( P_1 < P_2 ) and (( P_1_prv1 > P_2_prv1 ) or (( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 > P_2_prv2 )))))";
    public static CROSS_UP: string = "((( P_1 > P_2 ) and ( P_1_prv1 < P_2_prv1 )) or (( P_1 > P_2 ) and ( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 < P_2_prv2 )))";
    public static CROSS_DOWN: string = "((( P_1 < P_2 ) and ( P_1_prv1 > P_2_prv1 )) or (( P_1 < P_2 ) and ( P_1_prv1 = P_2_prv1 ) and ( P_1_prv2 > P_2_prv2 )))";
    public static ENTERING_CHANNEL: string = "(((P_1 < P_2) and (P_1 > P_3)) and ((( P_1_prv1 > P_2_prv1 ) or ( P_1_prv1 < P_3_prv1 ) ) or (( ( P_1_prv1 = P_2_prv1 ) or ( P_1_prv1 = P_3_prv1 ) ) and ( ( P_1_prv2 > P_2_prv2 ) or ( P_1_prv2 < P_3_prv2 )))))";
    public static EXITING_CHANNEL: string = "(((P_1 > P_2) or (P_1 < P_3)) and ((( P_1_prv1 < P_2_prv1 ) and ( P_1_prv1 > P_3_prv1 ) ) or (( ( P_1_prv1 = P_2_prv1 ) or ( P_1_prv1 = P_3_prv1 ) ) and ( ( P_1_prv2 < P_2_prv2 ) and ( P_1_prv2 > P_3_prv2 ))) ))";
}

