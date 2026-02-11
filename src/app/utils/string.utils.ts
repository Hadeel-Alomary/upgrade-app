import {Md5} from "./md5";

export class StringUtils {

    private static MAX_NUMBER_OF_DIGITS:number = 5;
    private static MIN_NUMBER_OF_DIGITS:number = 2;

    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static guid():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    static formatVariableDigitsNumber(n:number):string{
        if (!n && n !== 0 || n.toString() == '#') {
            return '-';
        }

        let digitsCount: number = StringUtils.digitsCount(n);

        if (digitsCount > StringUtils.MAX_NUMBER_OF_DIGITS) {
            digitsCount = StringUtils.MAX_NUMBER_OF_DIGITS;
        } else if (digitsCount < StringUtils.MIN_NUMBER_OF_DIGITS) {
            digitsCount = StringUtils.MIN_NUMBER_OF_DIGITS;
        }

        return StringUtils.formatMoney(n, digitsCount);
    }

    static format2DigitsNumber(n: number):string {
        if(!n && n !== 0 || n.toString() == '#') { return "-"; }
        return StringUtils.formatMoney(n);
    }

    static format3DigitsNumber(n:number):string{
        if(!n && n !== 0) { return "-"; }
        return StringUtils.formatMoney(n, 3);
    }

    static formatWholeNumber(n: number):string {
        if(!n && n !== 0 || n.toString() == '#') { return "-"; }
        return StringUtils.formatMoney(n, 0);
    }

    static substringCount(text:string, subString:string):number {
        // http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
        if (subString.length <= 0) return (text.length + 1);

        var n = 0,
        pos = 0,
        step = subString.length;

        while (true) {
            pos = text.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else break;
        }
        return n;

    }

    static hashCode(s:string):string {
        return (<string>Md5.hashStr(s)).substr(0,10);
    }

    static md5(s:string):string {
        return (<string>Md5.hashStr(s));
    }

    static md5Ascii(s:string):string {
        return (<string>Md5.hashAsciiStr(s));
    }

    static dataUriToByteArrayString(dataURI: string) {
        let byteString;

        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }
        let byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
        }

        return {
            byteArray: byteArray,
            byteString: byteString
        };
    }

    /* private */

    // http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
    // MA Al-Taleb has rewritten this to make it "type aware", so it is different from the original code copied from stackoverflow (link above)
    public static formatMoney(number: number, decimalPlacesCount: number = 2, decimalSeparator: string = '.', thousandsSeparator: string = ','):string{
        let sign = number < 0 ? "-" : "",
            absoluteNumber = Math.abs(number),
            wholeNumber: number = parseInt(absoluteNumber.toFixed(decimalPlacesCount)),
            wholeNumberAsString: string = wholeNumber.toString(),
            firstThousandsSeparatorPosition: number = wholeNumberAsString.length > 3 ? wholeNumberAsString.length % 3 : 0;

        let result: string = sign;
        if(firstThousandsSeparatorPosition) {
            result += wholeNumberAsString.substr(0, firstThousandsSeparatorPosition) + thousandsSeparator;
        }
        result += wholeNumberAsString.substr(firstThousandsSeparatorPosition).replace(/(\d{3})(?=\d)/g, "$1" + thousandsSeparator);
        if(decimalPlacesCount) {
            result += decimalSeparator + Math.abs(absoluteNumber - wholeNumber).toFixed(decimalPlacesCount).slice(2);
        }

        return result;
    }

    private static digitsCount(n:number) {
        if(isNaN(n)){
            return 0;
        }

        if (Math.floor(n) === n) {
            return 0;
        }
        return n.toString().split(".")[1].length || 0;
    }

    // https://stackoverflow.com/questions/13522782/how-can-i-tell-if-a-string-has-any-non-ascii-characters-in-it
    static hasOnlyAsciiCharacters(s:string):boolean{
        return /^[\u0000-\u007f]*$/.test(s);
    }

    static isNumber(s:string):boolean{
        return !(isNaN(+s));
    }

    static markLeftToRightInRightToLeftContext(string: string) {
        // when trying to display text that similar to: عربي (english) عربي
        // then punctuations may not be aligned properly. Use this method to add LTR marker to the string for proper alignment
        return "\u200E" + string + "\u200E";
    }

    static generateRandomString(length: number):string {
        let randomString = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            randomString += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return randomString;
    }

    static getHexFromAscii(input: string): string {
      let hex = '';
      for (let i = 0; i < input.length; i++) {
        hex += input.charCodeAt(i).toString(16);
      }
      return hex;
    }
}
