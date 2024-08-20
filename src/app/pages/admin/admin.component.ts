import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../services/record.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  collectionNames: string[] = ['guinnessRecords', 'f1Records', 'footballRecords', 'olympicRecords', 'wweRecords', 'ufcRecords', 'tennisRecords', 'nflRecords', 'nbaRecords', 'boxingRecords'];
  selectedCollection: string = this.collectionNames[0];
  records: { [key: string]: any[] } = {};
  newRecord: any = { title: '', description: '' };
  editingRecord: any = null;

  constructor(private recordsService: RecordsService) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.recordsService.getRecords(this.selectedCollection).then((data) => {
      this.records[this.selectedCollection] = data || [];
    }).catch((error) => {
      console.error('Error fetching records:', error);
    });
  }

  addRecord(): void {
    this.recordsService.addRecord(this.selectedCollection, this.newRecord).then(() => {
      this.fetchRecords();
      this.newRecord = { title: '', description: '' };
    }).catch((error) => {
      console.error('Error adding record:', error);
    });
  }

  editRecord(record: any): void {
    this.editingRecord = { ...record };
  }

  cancelEdit(): void {
    this.editingRecord = null;
  }

  updateRecord(): void {
    this.recordsService.updateRecord(this.selectedCollection, this.editingRecord).then(() => {
      this.fetchRecords();
      this.editingRecord = null;
    }).catch((error) => {
      console.error('Error updating record:', error);
    });
  }

  deleteRecord(recordId: string): void {
    this.recordsService.deleteRecord(this.selectedCollection, recordId).then(() => {
      this.fetchRecords();
    }).catch((error) => {
      console.error('Error deleting record:', error);
    });
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
}