// import {IndicatorHelper} from 'tc-web-chart-lib';

export class ChartAlertIndicator {

    public static CLOSE_INDICATOR_TYPE: number = -1;
    public static CLOSE_INDICATOR_ID: string = '';

    public get name(): string {
        if(this.indicatorType == ChartAlertIndicator.CLOSE_INDICATOR_TYPE) {
            return 'CLOSE';
        }
      return 'CLOSE';
        // return IndicatorHelper.indicatorToString(this.indicatorType) + ' ' + this.indicatorParametersString;
    }

    public get indicatorParametersString(): string {
        let parameters = this.indicatorParameters;
        return parameters.length > 0 ? `(${parameters.join(', ')})`.replace(new RegExp('\\$', 'g'), '') : '';
    }

    constructor(
        public indicatorType: number,
        public selectedIndicatorField: string,
        public indicatorParameters: (string | number)[],
        public indicatorId: string
    ) {}
}
