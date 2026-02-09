import {Component, signal, ViewEncapsulation} from '@angular/core';
import {CommonModule, NgComponentOutlet, NgIf} from '@angular/common';
import {AppComponent} from './app.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NgIf ,CommonModule,NgComponentOutlet, AppComponent],
  template: `
    <div class="loading-app" *ngIf="loading()">
      <div class="loading-container">
        <div>Loading ... </div>
      </div>
    </div>

    <div *ngIf="!loading()" class="app-content">
      <h1>{{ title() }}</h1>
      <app-root></app-root>
    </div>
  `,
  styleUrls: ['./index.component.css',
    './theme/vars.css',
    './theme/font.css',
    './theme/grid.css',
    './theme/dropdown.css',
    './theme/typeahead.css',
    './theme/tooltip.css',
    './theme/popover.css',
    './theme/modal.css',
    './theme/global.css',
    './theme/form.css',
    './theme/button.css',
    './theme/annotation-delayed.css',
    './theme/flag-annotation.css',
    './theme/upgrade-annotation.css',
    './theme/app-mode-themes/derayah.css'],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent {
  title = signal('angular-upgrade');
  loading = signal(true);

  appComponent = AppComponent;

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    if (!this.checkBrowser()) {
      window.location.href = '/browser.html';
      return;
    }

    const mobileClass = this.isMobile() ? 'mobile' : '';
    document.body.className = 'tickerchart ' + mobileClass;

    const selectedLanguage = location.pathname.split('/')[2] === 'en' ? 'en' : 'ar';
    localStorage.setItem('TC_LANGUAGE', selectedLanguage);

    const webAppMode = window.location.href.includes('derayah.tickerchart.net') ? 'derayah' : 'tickerchart';
    localStorage.setItem('TC_WEBAPP_MODE', webAppMode);

    const favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.type = webAppMode === 'derayah' ? 'image/png' : 'image/x-icon';
    favicon.href = webAppMode === 'derayah' ? '/favicon-derayah.png' : '/favicon.ico';
    document.head.appendChild(favicon);

    await new Promise(res => setTimeout(res, 1500));
    this.loading.set(false);
  }

  checkBrowser(): boolean {
    return true;
  }

  isMobile(): boolean {
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod|Android/i.test(ua) || screen.width <= 500;
  }
}
