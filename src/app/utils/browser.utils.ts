
export class BrowserUtils{

  public static isMobile():boolean {
      return document.body.classList.contains('mobile');
    }

    public static isDesktop():boolean {
        return !document.body.classList.contains('mobile');
    }

    public static isMobileScreenDimensions():boolean {
      return document.body.classList.contains('mobile');
    }

    private static _isWeb: boolean = false;
    public static setIsWebApp() {
      this._isWeb = true;
    }
    public static isWebApp() {
      return this._isWeb;
    }
}
