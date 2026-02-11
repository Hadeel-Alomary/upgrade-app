// import {IIndicatorOptions, IndicatorParam,ParameterOptions, ParameterValueType} from 'tc-web-chart-lib';
import cloneDeep from 'lodash/cloneDeep';
// const cloneDeep = require('lodash/cloneDeep');

export class AppThemeUtils {

    public static mapThemeValuesForBackwardCompatibility(currentThemeValues:{[key:string]:unknown}, defaultThemeValues:{[key:string]:unknown}) {
        // -----------------------------------------------------------------------------------
        // MA make sure that currentThemeValues matches "in structure" defaultThemeValues.
        // To do that:
        // 1) if there is any "structure" (ie object) in original theme and not in loaded theme, then copy it.
        // 2) if there is any "structure" (ie object) in loaded theme and not in original theme, then delete it.
        // 3) if there is any "values" that are in original theme but not in loaded theme, then copy them.
        // 4) if there is any "values" that are in loaded theme but not in original theme, then leave them as is, cause they maybe
        //    auto-generated values that aren't part of theme, since theme doesn't specify all optional attributes and they can be
        //    set later at run-time from drawing setting dialog.
        // -----------------------------------------------------------------------------------

        for(let key in defaultThemeValues) {
            if(!(key in currentThemeValues)){
                currentThemeValues[key] = cloneDeep(defaultThemeValues[key]); // step 1 & step 3
            } else if(typeof defaultThemeValues[key] === 'object') {
                this.mapThemeValuesForBackwardCompatibility(currentThemeValues[key] as {[key:string]:unknown},
                    defaultThemeValues[key] as {[key:string]:unknown}); // go recursively
            }
        }

        for(let key in currentThemeValues) {
            if(!(key in defaultThemeValues) && (typeof currentThemeValues[key] === 'object')){
                delete currentThemeValues[key]; // step 2
            }
        }

    }

    // public static mapIndicatorParametersForBackwardCompatibility(currentParams:{ [key: string]: ParameterOptions; } ,defaultParams: { [key: string]: ParameterOptions; } , isFinancial:boolean ) {
    //     // Remove any params not in defaultParams
    //     Object.keys(currentParams).forEach(key => {
    //         if (!(key in defaultParams)) {
    //             //Financial indicators don't include "FINANCIAL_PERIOD" in default settings and we need it in current parameters .
    //             // if (isFinancial && key == IndicatorParam.FINANCIAL_PERIOD) {
    //             //     defaultParams[key] = currentParams[key];
    //             // } else {
    //             //     delete currentParams[key];
    //             // }
    //         }
    //     });
    //
    //     // Merge defaults and current params
    //     Object.keys(defaultParams).forEach(key => {
    //         let defaultParam = defaultParams[key];
    //         let customParam = currentParams[key];
    //
    //         // let mergedParam: ParameterOptions = {value: 0, min: 0, max: 0};
    //         //
    //         // Object.keys(defaultParam).forEach(prop => {
    //         //     if (customParam && typeof customParam === 'object' && prop in customParam) {
    //         //         mergedParam[prop] = customParam[prop];
    //         //     } else {
    //         //         mergedParam[prop] = defaultParam[prop];
    //         //     }
    //         // });
    //
    //         // // If customParam is just a primitive value (like value: 5), override the value
    //         // if (customParam !== undefined && (typeof customParam !== 'object' || !('value' in customParam))) {
    //         //     mergedParam.value = customParam as ParameterValueType;
    //         // }
    //         // currentParams[key] = mergedParam;
    //     });
    // }

}
