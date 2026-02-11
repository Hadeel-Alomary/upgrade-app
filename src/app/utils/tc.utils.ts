import {TcUrlUtils} from "./tc.url.utils";
import {EnumUtils} from "./enum.utils";
import cloneDeep from 'lodash/cloneDeep';
// const cloneDeep = require("lodash/cloneDeep");

export class Tc {

  static _2digits(num:number):number {
    return Math.round(num * 100) / 100;
  }

  static assert(flag: boolean, message:string) {
    if(!flag){
      throw new Error(message);
    }
  }

  static warn(message:string){
    console.log("WARN: " + message);
    // TcTracker.trackMessage("WARN: " + message);
  }

  static error(error:string | Error){
    if(typeof error == "string"){
      throw new Error(error);
    }

    //NK throw the passed error as it's where tc-error-handler class will handle its type
    throw error;
  }

  static fatalExit(message:string) {
    // TcTracker.trackUrgentMessage("fatal exit: " + message);
  }

  static info(message:string) {
    console.log("INFO: " + message);
  }

  static url(url:string):string {
    return TcUrlUtils.url(url);
  }

  static enumValues(enumType:{[key:string]:unknown}):number[] {
    return EnumUtils.enumValues(enumType);
  }

  static enumString(enumType:{[key:number]:unknown}, enumValue:number):string {
    return EnumUtils.enumValueToString(enumType, enumValue);
  }


  // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
  static getBrowserVersion() {
    const ua = navigator.userAgent;
    let tem: RegExpMatchArray | null;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    // Make M type-safe
    if (!M || M.length === 0) return 'Unknown';

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua);
      return 'IE ' + (tem ? tem[1] : '');
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    // Check for version number in Safari/other browsers
    tem = ua.match(/version\/(\d+)/i);
    if (tem != null && M.length > 1) M.splice(1, 1, tem[1]);

    return M.join(' ');
  }


  // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  static getParameterByName(name:string, url:string = null) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  static debug(message: unknown, color?:string) {
    // colored console.log for debugging
    color = color || '#f00';
    console.log(`%c${message}`, `color: ${color}`);
  }

}
