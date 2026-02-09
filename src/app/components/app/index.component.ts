import {Component, signal, ViewEncapsulation} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {AppComponent} from './app.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NgIf ,CommonModule, AppComponent],
  templateUrl:'./index.component.html',
  styleUrls: ['./index.component.css'],
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
