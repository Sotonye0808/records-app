import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch as fasSearch } from '@fortawesome/free-solid-svg-icons';
import { faHome as fasHome } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle as fasInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    FontAwesomeModule,
    ThemeToggleComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router, library: FaIconLibrary) { 
    library.addIcons(
      fasSearch,
      fasHome,
      fasInfoCircle
    );
  }
}
