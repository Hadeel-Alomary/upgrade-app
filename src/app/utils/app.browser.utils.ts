export class AppBrowserUtils {

    public static getUserAgent():string{
        return window.navigator.userAgent;
    }

    public static isMac():boolean{
        return AppBrowserUtils.getUserAgent().includes("Mac");
    }

    public static isIPhone():boolean {
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        return /iPhone/.test(navigator.userAgent) && !(window as undefined as WindowExtension).MSStream;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ===> UNDERSTAND HOW MOBILE WORKS IN TICKERCHART WEB <===
    // MA in TickerChart Web, "mobile" word is used in two different context, and therefore, we need to differentiate between them.
    // FUNCTIONALITY: this is controlled by AppBrowserUtils.isMobile, and return true for both mobile and tablet. Therefore, forces both
    // of them (mobile and tablet) to have same feature and functionality.
    // STYLING: this is controlled by css class added to body. mobile classname is *only* used for mobile devices, and no tablets.
    // tablet styling is nearly the same as desktop styling, unless in very limited case, for which tablet customize their styling using
    // tablet classname added to the body.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private static mobileBrowser: boolean = null;
    public static isMobile():boolean {
       return this.isMobileOrTablet();
    }

    private static isMobileOrTablet():boolean {
        if(this.mobileBrowser == null) {
            this.mobileBrowser = this.checkMobileBrowser() || this.isTablet();
        }
        return this.mobileBrowser;
    }

    public static isDesktop():boolean {
        return !this.isMobile();
    }

    public static isMobileRotated():boolean {
        return  $("body").hasClass("mobile-rotated");
    }

    public static isMobileScreenDimensions():boolean {
        return !AppBrowserUtils.isTabletScreenDimensions();
    }

    public static isTabletScreenDimensions():boolean {
        if(!AppBrowserUtils.isMobile()){
            return false;
        }
        // Ehab tablet is detected as mobile. Add following to allow "differentiation" between mobile and tablet.
        // We check here width and height in portrait & landscape mode to better iPad dimensions detection.
        return AppBrowserUtils.isIPhone() ?
            $(window).width() >= 768 && $(window).height() >= 1024 || $(window).width() >= 1024 && $(window).height() >= 768 :
            screen.width >= 768 && screen.height >= 1024 || screen.width >= 1024 && screen.height >= 768;
    }

    private static checkMobileBrowser():boolean {
        return (window as undefined as WindowExtension).mobileCheck();
    };

    public static isTablet():boolean {
        return (window as undefined as WindowExtension).tabletCheck();
    }
}

interface WindowExtension extends Window {
    mobileCheck: () => boolean,
    tabletCheck: () => boolean,
    MSStream:boolean
}
