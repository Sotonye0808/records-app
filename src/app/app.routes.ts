import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { AboutComponent } from './pages/about/about.component';


export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full',
    data: { animation: 'Home' }
  },
  { 
    path: 'home', 
    component: HomeComponent ,
    data: { animation: 'Home' }
  },
  { 
    path: 'search', 
    component: SearchComponent,
    data: { animation: 'Search' }
  },
  { 
    path: 'about', 
    component: AboutComponent,
    data: { animation: 'About' }
  },
];
