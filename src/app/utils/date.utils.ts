
export class DateUtils{


    public static subtractBusinessDays(marketAbrv: string, days:number):Date{
        let date:Date = new Date();
        let remainingDays:number = days;
        while(remainingDays > 0){
            date = moment(date).subtract(1,'days').toDate();
            if(DateUtils.isBusinessDay(marketAbrv, date)){
                remainingDays -= 1;
            }
        }

        return date;
    }

    public static getLastBusinessDay(marketAbrv: string):Date {
        let date: Date = new Date();
        while (!DateUtils.isBusinessDay(marketAbrv, date)) {
            date = moment(date).subtract(1, 'days').toDate();
        }

        return date;
    }

    public static toDate(dateTime:string):string {
        return dateTime.substr(0, 'YYYY-MM-DD'.length);
    }

    public static isBusinessDay(marketAbrv: string, date:Date):boolean {
        //NK https://stackoverflow.com/questions/1181219/determine-if-a-date-is-a-saturday-or-a-sunday-using-javascript

        if(marketAbrv == "USA" || marketAbrv == "FRX" || marketAbrv == "DFM" || marketAbrv == "ADX") {
            return date.getDay() != 6 && date.getDay() != 0;
        }
        return date.getDay() != 5 && date.getDay() != 6;//NK 5 is Friday, 6 is Saturday
    }

    public static getSaudiDateTime(): string {
      //Get Saudi Date (GM+3 Date).
      let currentDate = new Date();
      currentDate.setUTCHours(currentDate.getUTCHours() + 3);
      let year = currentDate.getUTCFullYear();
      let month = ("0" + (currentDate.getUTCMonth() + 1)).slice(-2);//add a leading 0 if needed
      let day = ("0" + currentDate.getUTCDate()).slice(-2);
      let hour = ("0" + currentDate.getUTCHours()).slice(-2);
      let minutes = ("0" + currentDate.getUTCMinutes()).slice(-2);
      let seconds = ("0" + currentDate.getUTCSeconds()).slice(-2);

      return year + "-" + month + "-" + day + " " + hour + ':' + minutes + ":" + seconds; // format -> yyyy-mm-dd hh:mm:ss
    }
}
