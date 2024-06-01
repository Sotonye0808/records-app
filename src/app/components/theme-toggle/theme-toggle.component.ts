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

  ngOnInit() {
    if (this.isLocalStorageAvailable()) {
      this.checkTheme();
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

  checkTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.darkMode = storedTheme === 'dark';
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        this.faIcon = faSun;
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        this.faIcon = faMoon;
      }
    } else {
      // Default to system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.darkMode = true;
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        this.faIcon = faSun;
      }
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      this.faIcon = faSun;
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      this.faIcon = faMoon;
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
