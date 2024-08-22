import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecordsService } from '../../services/record.service';
import { RecordsStateService } from '../../services/records-state.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  collectionNames: string[] = ['guinnessRecords', 'f1Records', 'footballRecords', 'olympicRecords', 'wweRecords', 'ufcRecords', 'tennisRecords', 'nflRecords', 'nbaRecords', 'boxingRecords'];

  records: { [key: string]: any[] } = {};
  showRecordsTracker: { [key: string]: boolean } = {};

   loadingRecords: boolean = true;
   errorLoading: boolean = false;
   errorMessage: string = ''; 

   Bad = faWarning;
  
  constructor(
    private recordsService: RecordsService,
    private recordsStateService: RecordsStateService
  ) { 
    this.collectionNames.forEach((collectionName) => {
      this.showRecordsTracker[collectionName] = false;
    });
  }
  
  ngOnInit(): void {
    this.recordsStateService.records$.subscribe((records) => {
      this.records = records;
    });

    this.recordsStateService.loading$.subscribe((loading) => {
      this.loadingRecords = loading;
    });

    this.recordsStateService.errorLoading$.subscribe((errorLoading) => {
      this.errorLoading = errorLoading;
      this.errorMessage = 'Failed to load records. Please try again later.';
    });
  }

  showRecords(collectionName: string): void {
    this.showRecordsTracker[collectionName] = !this.showRecordsTracker[collectionName];
  }

  getCollectionTitle(collectionName: string): string {
    const titles: { [key: string]: string } = {
      guinnessRecords: 'Guinness World Records',
      f1Records: 'Formula 1',
      footballRecords: 'Football',
      olympicRecords: 'Olympics',
      wweRecords: 'WWE',
      ufcRecords: 'UFC',
      tennisRecords: 'Tennis',
      nflRecords: 'NFL',
      nbaRecords: 'NBA',
      boxingRecords: 'Boxing'
    };
    return titles[collectionName] || 'Records';
  }

  getCollectionDescription(collectionName: string): string {
    const descriptions: { [key: string]: string } = {
      guinnessRecords: 'Explore the most astonishing and remarkable records from around the world.',
      f1Records: 'Discover the top records in Formula 1 racing.',
      footballRecords: 'Dive into the records of World Cup, UEFA Champions League, and top European leagues.',
      olympicRecords: 'Discover the greatest achievements and records in the history of the Olympic Games.',
      wweRecords: 'Discover the most thrilling records in WWE history.',
      ufcRecords: 'Explore the top records in UFC.',
      tennisRecords: 'Find out the records in men\'s and women\'s tennis.',
      nflRecords: 'Check out the top records and achievements in the NFL.',
      nbaRecords: 'Explore the most impressive records in the history of the NBA.',
      boxingRecords: 'Check out the greatest records in the history of boxing.'
    };
    return descriptions[collectionName] || 'Explore the records.';
  }
}