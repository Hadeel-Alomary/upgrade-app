import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Tc} from "../../../utils/index";
import {MarketAlertMessage} from "../../streaming/index";
import {CredentialsStateService} from '../../state/index';
import {Loader, Market, MarketsManager} from '../loader/index';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';

@Injectable()
export class MarketAlertLoader extends ProxiedUrlLoader {

    constructor(private http: HttpClient, private credentialsService:CredentialsStateService, private marketsManager:MarketsManager, private loader: Loader, private proxyService: ProxyService){
        super(proxyService);
    }

    loadMarketAlerts(marketAbbr:string):Observable<MarketAlertMessage[]>{

        let market:Market = this.marketsManager.getMarketByAbbreviation(marketAbbr);
        let baseUrl:string = market.alertsHistoryUrl;

        let url:string = baseUrl + '?' +
            `user_name=${this.credentialsService.username}&market=${marketAbbr}&topic=MA`;

        Tc.info("request market alerts history: " + url);
        return this.http.get(this.getProxyAppliedUrl(url), {responseType: 'text'})
            .pipe(map( response => this.processMarketAlertData(response)));

    }

    private processMarketAlertData(response:string): MarketAlertMessage[] {

        let messages:MarketAlertMessage[] = [];

        /**********************Handle Exception****************************/
        /*Exception Message: Cannot read property 'split' of null */
        if(response == null){
            response = '';
        }
        /*******************************************************************/

        response.split('\n').forEach((line:string) => {
            line = line.trim();
            if(line == '') { return; }
            let segments:string[] = line.split(", "); // MA "space" is important! as "," can be part of value
            Tc.assert(segments.length == 4, "fail to parse line " + line);

            let message:MarketAlertMessage = {
                topic: "",
                time: "",
                symbol: "",
                Type: "",
                EV: ""
            };

            segments.forEach((segment:string) => {

                let fields:string[] = segment.split("=");
                Tc.assert(fields.length == 2, "fail to parse segment " + segment);

                let key:string = fields[0].trim();
                let value:string = fields[1].trim();

                switch(key) {
                case "time":
                    message.time = value;
                    break;
                case "symbol":
                    message.symbol = value;
                    break;
                case "Type":
                    message.Type = value;
                    break;
                case "EV":
                    message.EV = value;
                    break;
                default:
                    Tc.error("unknown key " + key);
                    break;
                }


            });

            messages.push(message);


        });

        return messages;

    }




}
