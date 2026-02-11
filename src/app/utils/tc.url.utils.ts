import {SecurityUtils} from "./security.utils";

export class TcUrlUtils{

    static url(url:string):string {
        let randomNumberAsString:string = 'rand=' + Math.round(Math.random() * 1000000000);
        if(url.includes('?')) {
            url += '&' + randomNumberAsString;
        } else {
            url += '?' + randomNumberAsString;
        }

        let timestamp:string = "t=" + 'none';
        url += '&' + timestamp;

        url = TcUrlUtils.hashUrl(url);

        return url;
    }

    private static hashUrl(url:string):string{
        let urlWithoutHostName = url.replace(new RegExp('^https?://'), '');
        urlWithoutHostName = urlWithoutHostName.replace(urlWithoutHostName.substr(0, urlWithoutHostName.indexOf('/')), '');
        let hValue = SecurityUtils.h(urlWithoutHostName);
        url += '&h=' + hValue;
        return url;
    }


}
