import {StringUtils} from "./string.utils";

export class SecurityUtils {

    private static k:string = 'UlhfMDZfMDFfMTVfVEM=';

    static h(m:string):string {
        return StringUtils.md5(atob(SecurityUtils.k) + m);
    }

    static hBefore(h:string):string{
        return StringUtils.md5(h + atob(SecurityUtils.k));
    }

}
