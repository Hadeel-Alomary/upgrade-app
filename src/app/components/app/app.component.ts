import {Component, signal, ViewEncapsulation} from '@angular/core';
import { NgIf } from '@angular/common'; // ✅ Import NgIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf], // ✅ Provide NgIf here
  template: `
    <div class="loading-app" *ngIf="loading()">
      <div class="loading-container">
        <img src="../../static/img/ajax.gif" alt="Loading...">
        <div class="logo">
          <img src="../../static/img/tickerchart-logo-white.png" alt="Logo">
        </div>
      </div>
    </div>

    <div *ngIf="!loading()" class="app-content">
      <h1>{{ title() }}</h1>
      <!-- Your app content here -->
    </div>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = signal('angular-upgrade');
  loading = signal(true); // ✅ Use signal
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
    this.loading.set(false);  // ✅ use .set() for signals
  }

  checkBrowser(): boolean {
    return true;
  }

  isMobile(): boolean {
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod|Android/i.test(ua) || screen.width <= 500;
  }
}
