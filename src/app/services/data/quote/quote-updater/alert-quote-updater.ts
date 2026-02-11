import {Injectable} from "@angular/core";
import {AlertService, AbstractAlert, AlertType, NormalAlert} from "../../alert/index";
import {Quote, Quotes} from "../quote";
import {Loader} from "../../../loader/index";
import {Tc} from "../../../../utils/index";
import {QuoteUpdater} from './quote-updater';

@Injectable()
export class AlertQuoteUpdater extends QuoteUpdater{
    
    constructor(private loader:Loader, private alertService:AlertService) {
        super();
        this.alertService.getAlertsHistoryLoadedStream().subscribe(loadingDone => {
                if (loadingDone) {
                    this.onLoaderDone()
                }
            },
            error => Tc.error(error));
    }
        
    private onLoaderDone() {
        for (let alert of this.alertService.getActiveAlerts()) {
            this.updateAlert(alert);
        }
        this.alertService.getAlertUpdatedStream().subscribe(alert => {
            alert.isActive() ? this.updateAlert(alert) : this.deleteAlert(alert);
        });
    }
    
    private updateAlert(alert: AbstractAlert){
        if(!alert.isNormalAlert()) {
            return;
        }
        let quote = Quotes.quotes.data[alert.company.symbol];
        Quote.updateAlert(quote, alert as NormalAlert);
        this.pushQuoteUpdate(alert.company.symbol);
    }
    
    private deleteAlert(alert: AbstractAlert) {
        if(!alert.isNormalAlert()) {
            return;
        }
        let quote = Quotes.quotes.data[alert.company.symbol];
        Quote.updateAlert(quote, null);
        this.pushQuoteUpdate(alert.company.symbol);
    }        
    
}
