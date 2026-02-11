export interface QuoteMessage {
    [key: string]: string,

    market:string,
    symbol:string,
    topic:string,

    last:string,
    open:string,
    min:string,
    max:string,
    date:string,
    change:string,
    volume:string,
    high:string,
    low:string,
    value:string,
    trades:string,
    pchange:string,

    plow:string,
    phigh:string,
    pclose:string,

    askprice:string,
    bidprice:string,
    askvolume:string,
    bidvolume:string,
    tav:string,
    tbv:string,

    direction:string,
    lastvolume:string,
    time:string,
    lasttradeprice:string,
    lastvalue:string,

    infloworders:string,
    inflowvalue:string,
    inflowvolume:string,
    outfloworders:string,
    outflowvalue:string,
    outflowvolume:string,

    week52low:string,
    week52high:string,

    issnapshot:string,
    maxlv:string,

    gclose:string,
    gvolume:string,

    fPrice:string,

    gwsi:string,
    gchange:string,
    gegi:string,
    gesi:string,
    gwgi:string,
    gpchange:string,

    ichange:string,
    egi:string,
    wsi:string,
    ipchange:string,
    esi:string,
    wgi:string,
    iclose:string,

    alerttype:string,
    alertev: string,
    alerttime: string

    ovalue: string,
    ovolume: string,
    otrades: string,
    cavlue: string,
    cvolume: string,
    ctrades: string
}

export interface HeartbeatMessage {
    market:string,
    topic:string,
    HBDateTimeS:string
}

export interface TimeAndSaleMessage {

    id:number,
    symbol:string,
    topic:string,

    date:string,
    time:string,
    last:string,
    lastvalue:string,
    lastvolume:string,

    direction:string,
    split:string,
    st:string,
    tradestate:string,

    [key: string]: unknown;
}

export interface MarketSummaryMessage {
    market:string,
    topic:string,
    totaltraded:string,
    pchange:string,
    index:string,
    liq:string,
    status:string,
    change:string,
    issnapshot:string,
    advances:string,
    date:string,
    time:string,
    declined:string,
    value:string,
    volume:string,
    trades:string,
    nochange:string
}


export interface MarketDepthMessage {
    [key: string]: string | boolean,

    symbol:string,
    topic:string,

    groupedByPrice:boolean,

    issnapshot:string,

    pa1?:string,
    pa2?:string,
    pa3?:string,
    pa4?:string,
    pa5?:string,
    pa6?:string,
    pa7?:string,
    pa8?:string,
    pa9?:string,
    pa10?:string,
    pa11?:string,
    pa12?:string,
    pa13?:string,
    pa14?:string,
    pa15?:string,

    na1?:string,
    na2?:string,
    na3?:string,
    na4?:string,
    na5?:string,
    na6?:string,
    na7?:string,
    na8?:string,
    na9?:string,
    na10?:string,
    na11?:string,
    na12?:string,
    na13?:string,
    na14?:string,
    na15?:string,

    qa1?:string,
    qa2?:string,
    qa3?:string,
    qa4?:string,
    qa5?:string,
    qa6?:string,
    qa7?:string,
    qa8?:string,
    qa9?:string,
    qa10?:string,
    qa11?:string,
    qa12?:string,
    qa13?:string,
    qa14?:string,
    qa15?:string,


    pb1?:string,
    pb2?:string,
    pb3?:string,
    pb4?:string,
    pb5?:string,
    pb6?:string,
    pb7?:string,
    pb8?:string,
    pb9?:string,
    pb10?:string,
    pb11?:string,
    pb12?:string,
    pb13?:string,
    pb14?:string,
    pb15?:string,

    nb1?:string,
    nb2?:string,
    nb3?:string,
    nb4?:string,
    nb5?:string,
    nb6?:string,
    nb7?:string,
    nb8?:string,
    nb9?:string,
    nb10?:string,
    nb11?:string,
    nb12?:string,
    nb13?:string,
    nb14?:string,
    nb15?:string,

    qb1?:string,
    qb2?:string,
    qb3?:string,
    qb4?:string,
    qb5?:string,
    qb6?:string,
    qb7?:string,
    qb8?:string,
    qb9?:string,
    qb10?:string,
    qb11?:string,
    qb12?:string,
    qb13?:string,
    qb14?:string,
    qb15?:string,

}

export interface MarketAlertMessage {
  topic: string,
  time: string,
  symbol: string,
  Type: string,
  EV: string,

  [key: string]: unknown;
}

export interface AlertMessage{
    ticker:string,
    id:string,
    price:string,
    time:string,
    param:string,
    "all-symbols":string,
    "all-times":string
}

export interface NewsMessage{
    ID:string,
    topic:string,
    MARKET_ABRV:string,
    SYMBOL:string,
    LANGUAGE:string,
    DATE:string,
    HEADER:string,
    IS_DELETED:string
}

export interface AnalysisMessage{
    topic: string;
    company_id: string;
    profile_name: string;
    user_type: string;
    avatar: string;
    deleted: boolean;
    url: string;
    nick_name: string;
    followers:number;
    title: string;
    thumbnail: string;
    video_url: string;
    created: string;
    description: string;
    views:number;
    likes:number;
    name: string
    comments: number,
    interval_name: string,
    interval_repeat:string,
}

export interface TradingMessage{
    id: number;
    topic: string;
    time: string;
    price: string;
    ticker: string;
    param: string;
}

export interface LiquidityMessage{
    topic: string;
    symbol: string;
    interval: string;
    time: string;
    percent: string;
    inflowAmount: string;
    inflowVolume: string;
    outflowAmount: string;
    outflowVolume: string;
    netAmount: string;
    netVolume: string;
}

export interface CommunityNotificationMessage {
    identifier: string
    topic: string,
    idea_company_id: string,
    idea_created: string,
    idea_url: string,
    profile_name: string,
    user_type: string,
    idea_profile_name: string,
    notification_type: string,
    idea_title: string,
    avatar: string,
    interval_repeat: string,
    nick_name: string,
    idea_thumbnail: string,
    idea_avatar: string,
    idea_user_type: string,
    created: string,
    interval_name: string,
    read: string,
    idea_video_url: string,
    idea_description: string,
    idea_nick_name: string,
    idea_name: string
}

export interface TechnicalScopeMessage{
    topic: string,
    symbol: string,
    value: string,
    signal: string,
    date: string,
}
