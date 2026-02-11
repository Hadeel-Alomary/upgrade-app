import {ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {LanguageService} from '../../../../services/state/language';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
    standalone:true,
    selector: 'password-field-wrapper',
    templateUrl: './password-field-wrapper.component.html',
    styleUrls: ['./password-field-wrapper.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports:[NgIf,FormsModule,NgClass]
})
export class PasswordFieldWrapperComponent implements OnInit {

    isHidden: boolean;
    input: HTMLInputElement;

    constructor(private elem: ElementRef, private renderer: Renderer2, private languageService: LanguageService) {}

    ngOnInit(): void {
        this.input = this.elem.nativeElement.querySelector('input');
        if (this.input) {
            this.isHidden = this.input.type === 'password';
            this.renderer.addClass(this.input, 'form-control'); // just to be sure
        } else {
            throw new Error(`No input element found. Please read the docs!`);
        }
    }

    public toggleShow(): void {
        this.isHidden = !this.isHidden;
        this.renderer.setAttribute(this.input, 'type', this.isHidden ? 'password' : 'text');
    }

    public get isArabic() {
        return this.languageService.arabic;
    }

    passwordClass() {
        return this.isHidden ? 'invisible-password' : 'visible-password';
    }
}
