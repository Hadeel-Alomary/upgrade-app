import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {LanguageService} from '../../../services/state/language';
import {BS_VIEW_PROVIDERS} from '../../../ng2-bootstrap/ng2-bootstrap';
import {MiscStateService} from '../../../services/state';
import {ReCaptcha2Component} from 'ngx-captcha';

@Component({
  selector: 'recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders:[BS_VIEW_PROVIDERS],
  encapsulation: ViewEncapsulation.None

})
export class RecaptchaComponent implements OnChanges, OnDestroy {

    @ViewChild('recaptchaElement') recaptchaElement: ReCaptcha2Component;
    public siteKey: string = '6LcgbX8fAAAAAPHoRwVvdZa1e8lkx3DHxZKLaZ5q';
    public recaptchaInput: string;
    @Input() resetRecaptcha: boolean;
    @Output() recaptchaSuccess = new EventEmitter<boolean>();
    @Output() recaptchaResponse = new EventEmitter<string>();

    constructor(public languageService: LanguageService, public miscStateService: MiscStateService) { }


    ngOnChanges(changes: SimpleChanges): void {
        if(this.resetRecaptcha){
            this.recaptchaElement.resetCaptcha();
        }
    }

    public handleReset() {
        this.recaptchaSuccess.emit(null);
        this.recaptchaResponse.emit(null);
    }

    public handleSuccess(captchaResponse: string) {
        this.recaptchaSuccess.emit(true);
        this.recaptchaResponse.emit(captchaResponse);
    }

    public handleExpire() {
        this.recaptchaSuccess.emit(false);
    }

    public getLanguage(): string {
        return this.languageService.arabic ? 'ar': 'en';
    }

    public getTheme(): string {
        return this.miscStateService.isDarkTheme() ? 'dark': 'light';
    }

    ngOnDestroy(): void {
        this.handleReset();
    }
}
