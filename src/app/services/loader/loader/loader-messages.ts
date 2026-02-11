
export interface AdvanceMessage{
    body:string;
    button:string;
    title:string;
    url:string
}

export interface SimpleMessage{
    body:string;
}

export interface BannerMessage {
    url: string,
    arabicUrlText: string,
    englishUrlText: string,
    imageUrl: string,
    mobileImageUrl: string,
    daysCount: number
}
