import {CategoryNewsResponse} from '../../loader/news-loader';

export class CategoryNews {
    constructor(
        public id: number,
        public date: string,
        public companyId: number
    ){}

    public static fromLoaderData(newsList: CategoryNewsResponse[]): CategoryNews[] {
        let result: CategoryNews[] = [];
        for(let news of newsList) {
            result.push(new CategoryNews(
                +news.news_id,
                news.daily_date,
                +news.company_id
            ))
        }
        return result;
    }
}
