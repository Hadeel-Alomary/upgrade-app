import {Market, Company} from '../../loader/index';
import {NewsMessage} from '../../streaming/index';

import {AppTcTracker, Tc}from '../../../utils/index';

export class News{

    public id:string;
    public date:string;
    public market:boolean;
    public symbol:string;
    public name:string;
    public header:string;
    public url:string;
    public deleted:boolean;
    public viewed:boolean;


    public static fromStreamer(message:NewsMessage, market:Market):News{
        let id:string = message.ID;
        let date:string = message.DATE;
        let header:string = message.HEADER;
        let symbol:string = message.SYMBOL;
        let deleted:boolean = message.IS_DELETED == 'YES';
        return News.createNews(market, symbol, id, date, header, deleted);
    }

    public static fromLoader(announcement: string[], market:Market):News{
        let id:string = announcement[0];
        let date:string = announcement[1];
        let header:string = announcement[2];
        let symbol:string = announcement[3];
        return News.createNews(market, symbol, id, date, header, false);
    }

    private static createNews(market:Market, symbol:string, id:string, date:string, header:string, deleted:boolean) {
        let company:Company;
        let isMarketNews:boolean = false;

        company = symbol ? market.getCompany(symbol) : null;
        if(!company){
            //Ehab: When company is deleted or ignored like Nomu, we will get no company --> so consider it a market news.
            isMarketNews = true;
            company = market.getGeneralIndex();
        }

        return {
            id: id,
            name: company.name,
            market: isMarketNews,
            symbol: company.symbol,
            date: date,
            header: header,
            url: 'https://www.tickerchart.com/tickerchart_live/AnnouncementDetails.php?announcementId=' + id,
            deleted: deleted,
            viewed: false
        };
    }

    public static getNewsFromIdAndTitle(id: number, title: string): News {
        return {
            id: `${id}`,
            name: null,
            market: null,
            symbol: null,
            date: null,
            header: title,
            url: `https://www.tickerchart.com/tickerchart_live/AnnouncementDetails.php?announcementId=${id}`,
            deleted: false,
            viewed: false
        };
    }
}
