import {Injectable} from '@angular/core';
import {Loader} from '../../../loader/index';
import {AnalysisCenterService, Analysis} from '../../analysis-center/index';
import {Tc} from '../../../../utils/index';
import {Quote, Quotes} from '../quote';
import {QuoteUpdater} from "./quote-updater";

@Injectable()
export class AnalysisQuoteUpdater extends QuoteUpdater{

    constructor(private loader:Loader, private analysisService:AnalysisCenterService){
        super();
        this.loader.isLoadingDoneStream()
            .subscribe((loadingDone:boolean) => {
                if(loadingDone){
                    this.onLoaderDone();
                }
            },
            error => Tc.error(error));
    }

    private onLoaderDone(){
        this.analysisService.getAnalysisStreamer()
            .subscribe(analysis => {
                this.onAnalysisUpdate(analysis);
            });
    }

    private onAnalysisUpdate(analysis:Analysis){
        let quote = Quotes.quotes.data[analysis.symbol];
        if(analysis.deleted){
            Quote.updateAnalysis(quote, null);
        } else {
            Quote.updateAnalysis(quote, analysis);
        }

        this.pushQuoteUpdate(analysis.symbol);
    }
}
