export class AppCountry {

    constructor(public code:string, public arabic:string, public english:string){}

    private static countries:AppCountry[] = [];

    public static getCountries():AppCountry[] {
        if(AppCountry.countries.length <= 0){
            AppCountry.countries.push(new AppCountry('+966','السعودية', 'Saudi Arabia'));
            AppCountry.countries.push(new AppCountry('+971','الامارات', 'United Arab Emirates'));
            AppCountry.countries.push(new AppCountry('+965', 'الكويت', 'Kuwait'));
            AppCountry.countries.push(new AppCountry('+974','قطر', 'Qatar'));
            AppCountry.countries.push(new AppCountry('+20','مصر', 'Egypt'));
            AppCountry.countries.push(new AppCountry('+962','الاردن', 'Jordan'));
            AppCountry.countries.push(new AppCountry('+968','سلطنة عمان', 'Oman'));
            AppCountry.countries.push(new AppCountry('+973','البحرين', 'Bahrain'));
            AppCountry.countries.push(new AppCountry('+','دولة أخرى', 'Others'));
        }
        return AppCountry.countries;
    }

    public static getSaudiCountryCode():string {
        return '+966';
    }

    public getCountryNameWithCode(arabic:boolean):string {
        let countryName:string = arabic ? this.arabic : this.english;
        return this.code == '+' ? countryName : `${countryName} (${this.code})`;
    }


}
