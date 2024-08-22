import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { AboutComponent } from './pages/about/about.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

import { RecordsService } from './services/record.service';
import { RecordsStateService } from './services/records-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HomeComponent,
    SearchComponent,
    AboutComponent,
    NavbarComponent,
    FooterComponent,
    FontAwesomeModule,
    ThemeToggleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'records-app';
  public animationsDisabled = false;

  constructor(
    private contexts: ChildrenOutletContexts,
    private recordsService: RecordsService,
    private recordsStateService: RecordsStateService
  ) {    
    this.fetchAllRecords();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  private fetchAllRecords() {
    const collectionNames = ['guinnessRecords', 'f1Records', 'footballRecords', 'olympicRecords', 'wweRecords', 'ufcRecords', 'tennisRecords', 'nflRecords', 'nbaRecords', 'boxingRecords'];
    const fetchPromises = collectionNames.map((collectionName) => this.recordsService.getRecords(collectionName));

    Promise.all(fetchPromises).then((results) => {
      const records: { [key: string]: any } = collectionNames.reduce((acc, collectionName, index) => {
        acc[collectionName] = results[index];
        return acc;
      }, {} as { [key: string]: any });
      this.recordsStateService.setRecords(records);
      this.recordsStateService.setLoading(false);
      // console.log('Records fetched!'); // Debugging log
    }).catch((error) => {
      console.error('Error fetching records:', error);
      this.recordsStateService.setErrorLoading(true);
      this.recordsStateService.setLoading(false);
    });
  }
}
