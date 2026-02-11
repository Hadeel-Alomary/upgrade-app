
export class EnumUtils {
    // http://stackoverflow.com/questions/21293063/how-to-programmatically-enumerate-an-enum-type-in-typescript-0-9-5
    static enumValues(enumType:{[key:string]:unknown}):number[] {
        return Object.keys(enumType).map(k => enumType[k]).filter(v => typeof v === "number") as number[];
    }

    static enumValueToString(enumType:{[key:number]:unknown}, enumValue:number):string {
        return enumType[enumValue] as string;
    }

    static enumStringToValue(enumType:{[key:string]:unknown}, enumString:string):number {
        return enumType[enumString] as number;
    }

}
