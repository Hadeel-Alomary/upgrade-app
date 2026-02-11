import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AnalysisMessage, Streamer} from '../../streaming/index';
import {AnalysisCenterLoaderService, Loader, MarketsManager} from '../../loader/index';
import {Analysis, Analyzer} from './analysis';
import {MiscStateService} from '../../state/index';
// import {AnalysisSortType} from '../../../components/analysis-center/analysis-sort/analysis-sort.component';
import {AppModeAuthorizationService} from '../../auhtorization';
import {AppModeFeatureType} from '../../auhtorization/app-mode-authorization';

@Injectable()
export class AnalysisCenterService{

    private analysisStreamer:Subject<Analysis>;

    constructor(
        streamer:Streamer,
        private loader:Loader,
        private analysisCenterLoaderService:AnalysisCenterLoaderService,
        private marketsManager:MarketsManager,
        private stateService:MiscStateService,
        private appModeAuthorizationService: AppModeAuthorizationService){

        this.analysisStreamer = new Subject();

        if(!this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.ALLOW_ANALYSIS_CENTER)){
            return
        }

        loader.isLoadingDoneStream().subscribe(loadingDone => {
            if(loadingDone) {
                this.marketsManager.getAllMarkets().forEach(market => {
                    streamer.getGeneralPurposeStreamer().subscribeAnalysis(market.abbreviation);
                    streamer.getGeneralPurposeStreamer().getAnalysisStreamer().subscribe(message => this.onStreamerMessage(message));
                })
            }
        });

    }

    public getAnalysisStreamer():Subject<Analysis>{
        return this.analysisStreamer;
    }

    // public analysisByAnalyzer(marketId: number, nickName: string, sortType: AnalysisSortType, pageNumber: number):Observable<Analysis[]>{
    //     return this.analysisCenterLoaderService.getAnalysesByAnalyst(marketId , nickName, sortType, pageNumber );
    // }
    //
    // public analysisByMarket(marketId: number, sortType: AnalysisSortType, pageNumber: number):Observable<Analysis[]>{
    //     return this.analysisCenterLoaderService.getAnalysesByMarket(marketId , sortType, pageNumber);
    // }

    public getAnalyzersList(marketId:number):Observable<Analyzer[]>{
        return this.analysisCenterLoaderService.getAnalystsList(marketId);
    }

    public communityHomePageUrl(): string {
        return this.analysisCenterLoaderService.getCommunityHomePageUrl();
    }

    public communityIdeasUrl(ideaId:string): string {
        return this.analysisCenterLoaderService.getCommunityIdeasUrl(ideaId)
    }

    public communityCompaniesUrl(companyId:number):string{
        return this.analysisCenterLoaderService.getCommunityCompaniesUrl(companyId);
    }

    public communityUsersUrl(nickName:string):string {
        return this.analysisCenterLoaderService.getCommunityUsersUrl(nickName);
    }

    public communityMarketIdeasUrl(marketId:number):string {
        return this.analysisCenterLoaderService.getCommunityMarketIdeasUrl(marketId);
    }

    public markAnalysisAsViewed(analysis:Analysis){
        if(!analysis.viewed){
            analysis.viewed = true;
            this.stateService.addViewedAnalysis(analysis.id);
            this.analysisStreamer.next(analysis);
        }
    }

    private onStreamerMessage(message:AnalysisMessage){
        // let analysis = this.analysisCenterLoaderService.mapStreamerMessageToAnalysis(message);
        // if(analysis) {
        //     this.analysisStreamer.next(analysis);
        // }
    }

}
