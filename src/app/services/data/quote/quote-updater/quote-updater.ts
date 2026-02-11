import {Subject} from 'rxjs';


export class QuoteUpdater{

    private quoteUpdaterStream:Subject<string>;
    
    constructor(){
        this.quoteUpdaterStream = new Subject();
    }

    public getQuoteUpdaterStream():Subject<string>{
        return this.quoteUpdaterStream;
    }

    protected pushQuoteUpdate(symbol:string):void{
        this.quoteUpdaterStream.next(symbol);
    }
}