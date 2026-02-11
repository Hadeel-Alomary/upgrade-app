declare const _g_prod: boolean;
declare const _g_version: string;

export class Config {

    static appStartTime:number;
    static urlSigningDate:string = 'none';
    static runType:string = 'app';

    static isProd():boolean {
        return _g_prod;
    }

    static getVersion():string {
        return _g_version;
    }

    static initElementRunType() {
        this.runType = 'element';
    }

    static isElementBuild():boolean {
        return this.runType == 'element';
    }

    static isAppBuild():boolean {
        return !Config.isElementBuild();
    }

}
