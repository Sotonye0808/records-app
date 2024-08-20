import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../services/record.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  
  newRecords: FormGroup[] = [];
  editingRecord: any = null;
  recordForm: FormGroup;

  constructor(
    private recordsService: RecordsService,
    private formBuilder: FormBuilder
  ) {
    this.recordForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      heldBy: this.formBuilder.group({
        team: ['', Validators.required],
        person: ['', Validators.required],
        nation: ['', Validators.required]
      }),
      dateRecorded: ['', Validators.required],
      sources: ['', Validators.required],
      relatedLinks: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchRecords();
    this.addNewRecord(); // Initialize with one empty record form
  }

  fetchRecords(): void {
    this.recordsService.getRecords(this.selectedCollection).then((data) => {
      this.records[this.selectedCollection] = data || [];
    }).catch((error) => {
      console.error('Error fetching records:', error);
    });
  }

  addNewRecord(): void {
    this.newRecords.push(this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      heldBy: this.formBuilder.group({
        team: ['', Validators.required],
        person: ['', Validators.required],
        nation: ['', Validators.required]
      }),
      dateRecorded: ['', Validators.required],
      sources: ['', Validators.required],
      relatedLinks: ['', Validators.required]
    }));
  }

  removeRecord(index: number): void {
    this.newRecords.splice(index, 1);
  }

  addRecords(): void {
    const recordsToAdd = this.newRecords.map(recordForm => {
      const record = recordForm.value;
      return {
        ...record,
        sources: record.sources?.split(',').map((source: string) => source.trim()),
        relatedLinks: record.relatedLinks?.split(',').map((link: string) => link.trim())
      };
    });

    // validate recordsToAdd
    if (recordsToAdd.some(record => !record.title || !record.description || !record.image || !record.heldBy.team || !record.heldBy.person || !record.heldBy.nation || !record.dateRecorded || !record.sources || !record.relatedLinks)) {
      console.error('All fields are required');
      return;
    }

    this.recordsService.addRecords(this.selectedCollection, recordsToAdd).then(() => {
      this.fetchRecords();
      this.newRecords = [];
      this.addNewRecord(); // Add one empty record form after submission
      
    }).catch((error) => {
      console.error('Error adding records:', error);
    });
  }

  editRecord(record: any): void {
    this.editingRecord = { ...record };
    this.recordForm.patchValue({
      title: record.title || '',
      description: record.description || '',
      image: record.image || '',
      heldBy: {
        team: record.heldBy?.team || '',
        person: record.heldBy?.person || '',
        nation: record.heldBy?.nation || ''
      },
      dateRecorded: record.dateRecorded || '',
      sources: record.sources?.join(', ') || '',
      relatedLinks: record.relatedLinks?.join(', ') || ''
    });
  }

  cancelEdit(): void {
    this.editingRecord = null;
  }

  updateRecord(): void {
    const updatedRecord = {
      ...this.editingRecord,
      ...this.recordForm.value,
      sources: this.recordForm.value.sources?.split(',').map((source: string) => source.trim()),
      relatedLinks: this.recordForm.value.relatedLinks?.split(',').map((link: string) => link.trim())
    };

    this.recordsService.updateRecord(this.selectedCollection, updatedRecord).then(() => {
      this.fetchRecords();
      this.editingRecord = null;
      this.recordForm.reset();
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