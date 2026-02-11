
export enum WatchlistType {
    Predefined = 1,
    UserDefined,
    Trading,
}

export interface Watchlist {
    type: WatchlistType,
    name: string,
    id: string,
    owner?: string,
    sectorId?: number,
    order?: number,
    symbols?:{[key:string]:string}
    description?: string,
}
