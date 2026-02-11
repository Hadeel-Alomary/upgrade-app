import {ChangeDetectorRef, Component, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {AppModeAuthorizationService, ChannelRequester, ChannelRequestType, CredentialsStateService, ForceLogoutType, LanguageService, LogoutService, MiscStateService, SharedChannel} from '../../services/index';
import {AppBrowserUtils, AppTcTracker} from '../../utils/index';
// import {MessageBoxRequest} from '../modals/popup/message-box';
import {AppModeFeatureType} from '../../services/auhtorization/app-mode-authorization';
import {RunningAppComponent} from './running-app.component';
import {NgFor, NgIf} from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    // './theme/vars.css',
    // './theme/font.css',
    // './theme/grid.css',
    // './theme/dropdown.css',
    // './theme/typeahead.css',
    // './theme/tooltip.css',
    // './theme/popover.css',
    // './theme/modal.css',
    // './theme/global.css',
    // './theme/button.css',
    // './theme/annotation-delayed.css',
    // './theme/flag-annotation.css',
    // './theme/upgrade-annotation.css',
    // './theme/app-mode-themes/derayah.css'
    ],
  encapsulation: ViewEncapsulation.None,
  imports:[RunningAppComponent,NgIf],
  host: {
    '(window:resize)': 'onResize()'
  }
})

export class AppComponent implements OnInit, ChannelRequester {

  public loadApp: boolean = true;
  public showDerayahLogoutView: boolean = false;

  // MA seems that it is needed for modals mask to work properly
  // https://valor-software.com/ng2-bootstrap/#/modals
  constructor(public viewContainerRef: ViewContainerRef,
              public credentialsService: CredentialsStateService,
              public tracker: AppTcTracker, // MA needed to construct AppTcTracker
              public sharedChannel: SharedChannel,
              public languageService: LanguageService,
              public miscStateService:MiscStateService,
              public logoutService:LogoutService,
              public appModeAuthorizationService: AppModeAuthorizationService,
              public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if(AppBrowserUtils.isDesktop()) {
      AppTcTracker.trackDevice('desktop');
      // http://stackoverflow.com/questions/9958825/how-do-i-bind-twitter-bootstrap-tooltips-to-dynamically-created-elements
      // $('body').tooltip({
      //   selector: '[data-toggle="tooltip"]',
      //   container: 'body',
      //   placement: (tooltip: HTMLElement, element: HTMLElement) => {
      //     // return DomUtils.tooltipPosition(this.languageService.getLanguage(), element);
      //   }
      // });
    } else {
      AppTcTracker.trackDevice('mobile');
      if(AppBrowserUtils.isIPhone()) {
        AppTcTracker.trackDevice('iphone');
        // MA disable bouncing effect on mobile
        // https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect
        document.body.addEventListener('touchmove', e => {
          // MA for iphone, we disable scrolling unless specifically enabled by class iphone-allow-scrolling on the container
          let allowScrolling = 0 < $(e.srcElement).closest('.iphone-allow-scrolling').length;
          if (!allowScrolling) {
            e.preventDefault();
          }
        }, { passive: false });
      }
    }
    this.addLanguageCssBodyClass();
    this.addMobileCssBodyClass();
    this.handleRotateMobileScreen();
    this.updateDarkCssBodyClass();

    this.sharedChannel.getRequestStream().subscribe(request => {
      if(request.type == ChannelRequestType.SwitchTheme) {
        this.updateDarkCssBodyClass();
      } else if(request.type == ChannelRequestType.DerayahModeLogout) {
        setTimeout(()=>{
          this.loadApp = false;
          this.showDerayahLogoutView = true;
          this.cd.markForCheck();
        }, 0);
      }
    });

  }

  addLanguageCssBodyClass() {
    let className: string = this.isArabic() ? 'arabic' : 'english';
    $('body').addClass(className);
  }

  isArabic(): boolean {
    return this.languageService.arabic;
  }


  onResize() {
    this.addMobileCssBodyClass();
    this.handleRotateMobileScreen();
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
  addMobileCssBodyClass() {
    if(AppBrowserUtils.isMobile()) {
      if(AppBrowserUtils.isMobileScreenDimensions()) {
        $('body').removeClass('tablet');
        // MA for styling mobile devices
        $('body').addClass('mobile');
        if(AppBrowserUtils.isIPhone()) {
          $('body').addClass('iphone');
        }
        // MA add standalone css used when opening app from home screen
        // https://stackoverflow.com/questions/21125337/how-to-detect-if-web-app-running-standalone-on-chrome-mobile
        if( (AppBrowserUtils.isIPhone() && (navigator as StandaloneNavigator).standalone) ||
          (!AppBrowserUtils.isIPhone() && window.matchMedia('(display-mode: standalone)').matches) ) {
          $('body').addClass('standalone');
        }
      } else {
        // MA for styling tablet devices
        $('body').addClass('tablet');
      }
    }
  }

  private handleRotateMobileScreen(): void {
    if(AppBrowserUtils.isMobile()) {
      let inPortraitMode = $(window).height() < $(window).width();
      if (inPortraitMode) {
        $('body').addClass('mobile-rotated');
      } else {
        $('body').removeClass('mobile-rotated');
      }
    }
  }

  updateDarkCssBodyClass() {
    if(this.miscStateService.isDarkTheme()) {
      $('body').addClass('dark');
    } else {
      $('body').removeClass('dark');
    }
  }

  /* interactive events */

  onLogout() {
    this.credentialsService.logout();

    let message1:string = 'سوف يتم الخروج من حسابك في تكرتشارت ويب';
    let message2:string = 'لاستخدام الحساب، سوف تحتاج إلى تسجيل الدخول مرة أخرى.';
    if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_LOGOUT)) {
      message1 = this.languageService.arabic ? 'تم تسجيل الخروج من حسابك بنجاح.' : 'You have been logged out successfully.';
      message2 = '';
    }
    // let request:MessageBoxRequest = {type: ChannelRequestType.MessageBox, requester: this, messageLine: message1, messageLine2: message2};
    // this.sharedChannel.request(request);
  }

  onFailToLogin(errorType: ForceLogoutType) {
    let message:string;
    let forceLogout:boolean = false;
    let clearPassword:boolean = false;
    switch (errorType) {

      ///////////////////////////////////////////////////////////
      // MA FORCE LOGOUT for all the below errors (so we don't retry to login again with same credentials)
      case ForceLogoutType.InvalidCredentials:
        message = 'معلومات الدخول خاطئة. يرجى المحاولة الدخول مرة أخرى.';
        forceLogout = true;
        break;
      case ForceLogoutType.UnsupportedMarket:
        message = 'خدمة تكرتشارت ويب غير متاحة للسوق المشترك به';
        forceLogout = true;
        break;
      case ForceLogoutType.UnsubscripedUser:
        message = 'ليس لديك اشتراك فعال بخدمة تكرتشارت ويب';
        clearPassword = true;
        break;
      case ForceLogoutType.OtherMachineLoggedIn:
        message = 'لقد تم الخروج بسبب الاتصال من جهاز آخر';
        clearPassword = true;
        break;
      ///////////////////////////////////////////////////////////
      case ForceLogoutType.FailToConnect:
        message = 'لا يمكن الاتصال بالانترنت. يرجى المحاولة لاحقا.';
        break;
      default:
        message = 'لا يمكن الدخول. يرجى المحاولة لاحقا.';
        message = this.appModeAllowedFeature(AppModeFeatureType.END_DERAYAH_SESSION) ? 'انتهت الجلسة! يرجى إغلاق البرنامج وفتحه مرة أخرى عن طريق منصة دراية.' : 'لا يمكن الاتصال بالانترنت. يرجى المحاولة لاحقا.';

        break;
    }

    if(forceLogout) {
      this.credentialsService.logout();
    }

    if(clearPassword) {
      this.credentialsService.clearPassword();
    }

    // let request:MessageBoxRequest = {type: ChannelRequestType.MessageBox, requester: this, messageLine: message};
    // this.sharedChannel.request(request);

  }

  onRequestComplete(): void {
    if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_LOGOUT)){
      window.close();
    }
    this.onReload();
  }

  onReload() {
    this.logoutService.reload();
  }

  isMobile():boolean {
    return AppBrowserUtils.isMobile();
  }

  public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
    return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
  }
}

interface StandaloneNavigator extends Navigator {
  standalone :boolean
}
