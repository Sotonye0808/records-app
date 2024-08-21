import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  imports: [FontAwesomeModule]
})
export class ThemeToggleComponent implements OnInit {
  darkMode = false;
  faIcon = faMoon;
  faMoon = faMoon;
  faSun = faSun;
  
  private prefersDarkScheme: MediaQueryList | null = null;
  private localStorageKey = 'theme';

  constructor () {}

  ngOnInit() {
    if (this.isLocalStorageAvailable()) {
      this.initializeTheme();
      this.listenToSystemThemeChanges();
    }
  }

  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorageTest__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  initializeTheme() {
    if (typeof window !== 'undefined') {
      this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      const storedTheme = localStorage.getItem(this.localStorageKey);
      if (storedTheme) {
        this.applyTheme(storedTheme === 'dark');
      } else {
        this.applyTheme(this.prefersDarkScheme.matches);
      }
    }
  }

  applyTheme(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      this.faIcon = this.faSun;
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      this.faIcon = this.faMoon;
    }
  }

  listenToSystemThemeChanges() {
    if (this.prefersDarkScheme) {
      this.prefersDarkScheme.addEventListener('change', (event) => {
        const storedTheme = localStorage.getItem(this.localStorageKey);
        if (!storedTheme) {
          this.applyTheme(event.matches);
        } else {
          const currentTheme = storedTheme === 'dark';
          const systemPreferenceChanged = this.prefersDarkScheme?.matches !== currentTheme;
          if (systemPreferenceChanged && this.prefersDarkScheme) {
            this.applyTheme(this.prefersDarkScheme.matches);
            localStorage.removeItem(this.localStorageKey);
          }
        }
      });
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme(this.darkMode);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.localStorageKey, this.darkMode ? 'dark' : 'light');
    }
  }
}