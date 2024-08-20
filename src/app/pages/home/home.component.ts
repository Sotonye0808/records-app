import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsService } from '../../services/record.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  collectionNames: string[] = ['guinnessRecords', 'f1Records', 'footballRecords', 'olympicRecords', 'wweRecords', 'ufcRecords', 'tennisRecords', 'nflRecords', 'nbaRecords', 'boxingRecords'];

  records: { [key: string]: any[] } = {};
  showRecordsTracker: { [key: string]: boolean } = {};

  constructor(private recordsService: RecordsService) { 
    this.collectionNames.forEach((collectionName) => {
      this.showRecordsTracker[collectionName] = false;
    });
  }

  ngOnInit(): void {
    this.collectionNames.forEach((collectionName) => {
      this.fetchRecords(collectionName);
    });
    // console.log('Records:', this.records); // Debugging log
  }

  fetchRecords(collectionName: string): void {
    this.recordsService.getRecords(collectionName).then((data) => {
      this.records[collectionName] = data || [];
    }).catch((error) => {
      console.error('Error fetching records:', error);
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