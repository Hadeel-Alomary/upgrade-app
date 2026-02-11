import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Company, Loader, MarketsManager} from '../loader/index';
import {Analysis,Analyzer,} from '../../data/analysis-center/analysis';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tc} from '../../../utils/index';
import {CredentialsStateService, LanguageService} from '../../state/index';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';
import {AuthorType, CommunityAuthorType} from '../../data/community/community';
import {AnalysisSortType} from '../../../components/analysis-center/analysis-sort/analysis-sort.component';
import {AnalysisMessage} from '../../streaming';
import {Interval} from 'tc-web-chart-lib';
import {MiscStateService} from '../../state';
import {LoaderConfig, LoaderUrlType} from '../loader';

@Injectable()
export class AnalysisCenterLoaderService extends ProxiedUrlLoader{

    constructor(private http:HttpClient, private loader:Loader, private credentialsService:CredentialsStateService, private marketsManager:MarketsManager,
                private proxyService: ProxyService , private stateService:MiscStateService,private languageService:LanguageService){
        super(proxyService);
    }

    public getAnalystsList(marketId: number): Observable<Analyzer[]> {
        let basicUrl = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.AnalystsList);
        let url = basicUrl.replace('{0}',`${marketId}`);

        Tc.info('analyzers list url: ' + url);

        return this.http.get(url)
            .pipe(map((response: AnalyzersResponse) => {
                    Tc.assert(response.success, 'fail to get analyzers list');
                    return this.processAnalyzers(response.response.profiles);
                }
            ));
    }

    public getAnalysesByAnalyst(marketId: number, nickName: string, sortType: AnalysisSortType, pageNumber: number): Observable<Analysis[]> {
        let basicUrl = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.AnalysisByMarket);
        let url = basicUrl.replace('{0}',`${marketId}`);
        url = url.replace('{1}',`${this.getSortTypeAsString(sortType)}`);
        url = url.replace('{2}',`${pageNumber}`);
        url = url + `?analyst=${nickName}`;


        Tc.info('analysis search url: ' + url);

        return this.http.get(url)
            .pipe(map((response: AnalysisResponse) => {
                Tc.assert(response.success, 'fail on analysis search');
                return this.processAnalyses(response.response.ideas);
                }
            ));
    }

    public getAnalysesByMarket(marketId: number, sortType: AnalysisSortType, pageNumber: number): Observable<Analysis[]> {
        let basicUrl = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.AnalysisByMarket);
        let url = basicUrl.replace('{0}',`${marketId}`);
        url = url.replace('{1}',`${this.getSortTypeAsString(sortType)}`);
        url = url.replace('{2}',`${pageNumber}`);


        Tc.info('analysis search by market url: ' + url);

        return this.http.get(url)
            .pipe(map((response: AnalysisResponse) => {
                    Tc.assert(response.success, 'fail on analysis search by market');
                    return this.processAnalyses(response.response.ideas);
                }
            ));
    }

    /* Process Data */

    private processAnalyzers(profiles: AnalyzerResponse[]): Analyzer[] {
        let analyzers:Analyzer[] = [];

        for(let profile of profiles){
            let analyzer:Analyzer = new Analyzer(profile.name, profile.nick_name);
            analyzers.push(analyzer);
        }

        return analyzers;
    }

    private processAnalyses(ideas: AnalysisIdeasResponse[]): Analysis[] {
        let analysis: Analysis[] = [];

        for (let value of ideas) {
            let company = this.getCompanyById(value.company_id);
            if(!company) {//Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
                continue;
            }
            let item: Analysis = {
                id:value.name,
                title: value.title,
                description: value.description,
                created: moment(value.created).format('YYYY-MM-DD'),
                url: value.url,
                thumbnailUrl: value.thumbnail,
                videoUrl: value.video_url,
                nickName: value.nick_name,
                profileName: value.profile_name,
                authorType: this.getAuthorType(value.user_type),
                avatarUrl: value.avatar,
                views: value.views,
                likes: value.likes,
                comments: value.comments,
                followers: value.followers,
                deleted: false,
                viewed: false,
                symbol:company.symbol,
                company: company,
                intervalName:Interval.getIntervalNameFromCommunityServerMessage(value.interval_name , value.interval_repeat,this.languageService.arabic),
            };

            if(item.company) {
                analysis.push(item);
            }
        }

        return analysis;
    }

    public mapStreamerMessageToAnalysis(message: AnalysisMessage): Analysis {
        let company = this.getCompanyById(message.company_id);
        if(!company) {//Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
            return null;
        }
        return {
            id:message.name,
            title: message.title,
            description: message.description,
            created: moment(message.created).format('YYYY-MM-DD'),
            url: message.url,
            thumbnailUrl: message.thumbnail,
            videoUrl: message.video_url,
            nickName: message.nick_name,
            profileName: message.profile_name,
            authorType: this.getAuthorType(message.user_type),
            avatarUrl: message.avatar,
            views: message.views,
            likes: message.likes,
            comments: message.comments,
            followers: message.followers,
            deleted: false,
            viewed: this.stateService.isViewedAnalysis(message.name),
            symbol:this.getCompanyById(message.company_id).symbol,
            company: this.getCompanyById(message.company_id),
            intervalName:Interval.getIntervalNameFromCommunityServerMessage(message.interval_name , message.interval_repeat,this.languageService.arabic),
        };
    }

    private getCompanyById(companyId: string):Company {
        return  this.marketsManager.getCompanyById(+companyId) ;
    }

    public getCommunityHomePageUrl(): string {
        return  LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityHomePageUrl);
    }

    public getCommunityIdeasUrl(ideaId: string): string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityIdeaUrl);

        return url.replace('{1}', `${ideaId}`);
    }

    public getCommunityCompaniesUrl(companyId: number): string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityCompanyUrl);

        return url.replace('{1}', `${companyId}`);
    }

    public getCommunityUsersUrl(nickName: string): string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityUserProfileUrl);

        return url.replace('{1}', `${nickName}`);
    }

    public getCommunityMarketIdeasUrl(marketId:number):string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityMarketUrl);

        return url.replace('{1}', `${marketId}`);
    }

    private getAuthorType(authorType:string):CommunityAuthorType {
        switch (authorType) {
            case 'user':
                return {type: AuthorType.USER, arabicDescription: 'مستخدم', englishDescription: 'User',className:'user'};

            case 'analyst':
                return {type: AuthorType.ANALYST, arabicDescription: 'محترف', englishDescription: 'PRO',className:'analyst'};

            default:
                Tc.error(`Invalid community author type ${authorType}`);
        }
    }

    private getSortTypeAsString(sortType: AnalysisSortType):string {
        if (sortType == AnalysisSortType.Time)
            return 'time';

        if(sortType == AnalysisSortType.Popularity)
            return 'popularity';
    }

}
interface AnalyzersResponse {
    success: boolean,
    response: {
        profiles: AnalyzerResponse[]
    }
}

interface AnalyzerResponse {
    id: string,
    name: string,
    nick_name: string
}

interface AnalysisResponse {
    success: boolean,
    response : {
        ideas: AnalysisIdeasResponse[]
    }
}

interface AnalysisIdeasResponse {
    name: string;
    title: string;
    description: string;
    created: string;
    url: string;
    thumbnail: string;
    video_url: string;
    nick_name: string;
    profile_name: string;
    user_type: string;
    avatar: string;
    views: number;
    likes: number;
    comments: number;
    followers: number;
    company_id:string;
    interval_name: string,
    interval_repeat:string,
}
