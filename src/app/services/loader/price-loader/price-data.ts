export interface PriceData {
    time:string,
    open:number,
    high:number,
    low:number,
    close:number,
    volume:number,
    amount:number,
    contracts:number,
    state?:string,
    direction?:string,
    specialTrade?:boolean
    id?:number
}
