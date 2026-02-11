import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Tc} from "../../../utils/index";
import {TimeAndSaleMessage} from "../../streaming/index";
import {CredentialsStateService} from '../../state/index';
import {MarketsManager, Market, Loader} from '../loader/index';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';

@Injectable()
export class BigTradeLoader extends ProxiedUrlLoader{

    constructor(private http: HttpClient, private credentialsService:CredentialsStateService, private marketsManager:MarketsManager, private loader: Loader, private proxyService: ProxyService){
        super(proxyService);
    }

    loadBigTrades(marketAbbr:string):Observable<TimeAndSaleMessage[]>{

        let market:Market = this.marketsManager.getMarketByAbbreviation(marketAbbr);
        let baseUrl:string = market.alertsHistoryUrl;

        let url:string = baseUrl + '?' +
            `user_name=${this.credentialsService.username}&market=${marketAbbr}&topic=BT`;

        Tc.info("request big trade history: " + url);
        return this.http.get(this.getProxyAppliedUrl(url), {responseType: 'text'})
            .pipe(map(response => this.processHistoryData(response)));
    }

    private processHistoryData(response:string): TimeAndSaleMessage[] {

        let messages:TimeAndSaleMessage[] = [];

        /**********************Handle Exception****************************/
        /*Exception Message: Cannot read property 'split' of null */
        if(response == null){
            response = '';
        }
        /*******************************************************************/

        response.split('\n').forEach((line:string) => {

            line = line.trim();
            if(line == '') { return; }
            let segments:string[] = line.split(",");
            Tc.assert(segments.length == 11 || segments.length == 10, "fail to parse line " + line);//NK 11 for Saudi market and 10 for the other markets

            let message:TimeAndSaleMessage = {
                id:0,
                symbol:"",
                topic:"",
                date:"",
                time:"",
                last:"",
                lastvalue:"",
                lastvolume:"",
                direction:"",
                split:"",
                st:"",
                tradestate:""
            };

            segments.forEach((segment:string) => {

                // MA special handling for direction== (as next logic won't work for it)
                if(segment.trim() == 'direction=='){
                    message.direction = '=';
                    return;
                }

                let fields:string[] = segment.split("=");
                Tc.assert(fields.length == 2, "fail to parse segment " + segment);

                let key:string = fields[0].trim();
                let value:string = fields[1].trim();

                switch(key) {
                    case 'id':
                        message.id = +value;
                        break;
                    case 'time':
                        message.time = value;
                        break;
                    case 'symbol':
                        message.symbol = value;
                        break;
                    case 'last':
                        message.last = value;
                        break;
                    case 'direction':
                        message.direction = value;
                        break;
                    case 'lastvalue':
                        message.lastvalue = value;
                        break;
                    case 'split':
                        message.split = value;
                        break;
                    case 'st':
                        message.st = value;
                        break;
                    case 'date':
                        message.date = value;
                        break;
                    case 'tradestate':
                        message.tradestate = value;
                        break;
                    case 'lastvolume':
                        message.lastvolume = value;
                        break;
                    default:
                        Tc.error('unknown key ' + key);
                        break;
                }


            });

            messages.push(message);


        });

        return messages;

    }

}
