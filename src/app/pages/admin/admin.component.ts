import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordsService } from '../../services/record.service';
import { RecordsStateService } from '../../services/records-state.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faAdd, faUpload, faCancel, faFileUpload, faCircleXmark, faFaceSadCry, faWarning, faMinus, faRecycle } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LoaderComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  collectionNames: string[] = ['guinnessRecords', 'f1Records', 'footballRecords', 'olympicRecords', 'wweRecords', 'ufcRecords', 'tennisRecords', 'nflRecords', 'nbaRecords', 'boxingRecords'];
  selectedCollection: string = this.collectionNames[0];

  records: { [key: string]: any[] } = {};

  newRecords: FormGroup[] = [];
  recordForm: FormGroup;

  editingRecord: any = null; // similar object to records but to keep track of records being edited possibly with boolean values to track if editing form should be displayed
  editingRecords: any[] = [];
  recordForms: { [key: string]: FormGroup } = {}; // Add a new property to track form groups for each record

  showModal: boolean = false;
  modalMessage: string = '';
  recordForAction: any = null;

  loadingRecords: boolean = true;
  executingAction: boolean = false;
  feedbackMessage: string = '';
  errorMessages: string[] = []; 

  Edit = faEdit;
  Delete = faTrash;
  Add = faAdd;
  Minus = faMinus;
  Upload = faUpload;
  Cancel = faCancel;
  Update = faFileUpload;
  Close = faCircleXmark;
  Good = faCheckSquare;
  Bad = faFaceSadCry;
  Warning = faWarning;
  Bin = faRecycle; 
  icon: any = null;



  constructor(
    private recordsService: RecordsService,
    private recordsStateService: RecordsStateService,
    private fb: FormBuilder
  ) {
    this.recordForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      heldBy: this.fb.group({
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
    this.loadFormsData();
  }

  ngOnDestroy(): void {
    this.saveFormsData('all');
  }

  fetchRecords(): void {
    try {
      this.recordsStateService.records$.subscribe((records) => {
        this.records = records;
      });

      this.recordsStateService.loading$.subscribe((loading) => {
        this.loadingRecords = loading;
      });

      this.recordsStateService.errorLoading$.subscribe((errorLoading) => {
        if (errorLoading) {
          this.errorMessages.push('Failed to load records. Please try again later.');
          this.icon = this.Bad;
        }
      });
    } catch (error) {
      console.error('Error fetching records:', error);
      this.loadingRecords = false;
      this.errorMessages.push('Error fetching records');
      this.icon = this.Bad;
    }
  }
  
  addRecords(): void {
    // first check if all forms are valid
    if (this.newRecords.some(recordForm => recordForm.invalid)) {
      console.error('Invalid form data');
      this.executingAction = false;
      this.feedbackMessage = '';
      this.errorMessages.push('Invalid form data for new record: ' + (this.newRecords.findIndex(recordForm => recordForm.invalid) + 1));
      this.icon = this.Bad;
    } else {
      const recordsToAdd = this.newRecords.map(recordForm => {
        const record = recordForm.value;
        return {
          ...record,
          sources: record.sources?.split(',').map((source: string) => source.trim()),
          relatedLinks: record.relatedLinks?.split(',').map((link: string) => link.trim())
        };
      });

      this.recordsService.addRecords(this.selectedCollection, recordsToAdd).then(() => {
        recordsToAdd.forEach(record => this.recordsStateService.addRecord(this.selectedCollection, record));
        this.newRecords = [];
        this.addNewRecord(); // Add one empty record form after submission
        this.clearFormsData('newRecords');
        this.executingAction = false;
        this.feedbackMessage = 'Records uploaded successfully';
        this.icon = this.Good;
      }).catch((error) => {
        console.error('Error adding records:', error);
        this.executingAction = false;
        this.feedbackMessage = '';
        this.errorMessages.push('Error adding records');
        this.icon = this.Bad;
      });
    }
  }

  addNewRecord(): void {
    const newRecordForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      heldBy: this.fb.group({
        team: ['', Validators.required],
        person: ['', Validators.required],
        nation: ['', Validators.required]
      }),
      dateRecorded: ['', Validators.required],
      sources: ['', Validators.required],
      relatedLinks: ['', Validators.required]
    });

    this.newRecords.push(newRecordForm);
  }

  removeRecord(index: number): void {
    this.newRecords.splice(index, 1);
  }


  // Modify the editRecord method to handle multiple records
  editRecord(record: any): void {
    const existingRecord = this.editingRecords.find(r => r._id === record._id);
    if (!existingRecord) {
      this.editingRecords.push({ ...record });
    }
    // Create a new form group for the record if it doesn't exist
    if (!this.recordForms[record._id]) {
      this.recordForms[record._id] = this.fb.group({
        title: [record.title || '', Validators.required],
        description: [record.description || '', Validators.required],
        image: [record.image || '', Validators.required],
        heldBy: this.fb.group({
          team: [record.heldBy?.team || '', Validators.required],
          person: [record.heldBy?.person || '', Validators.required],
          nation: [record.heldBy?.nation || '', Validators.required]
        }),
        dateRecorded: [record.dateRecorded || '', Validators.required],
        sources: [record.sources?.join(', ') || '', Validators.required],
        relatedLinks: [record.relatedLinks?.join(', ') || '', Validators.required]
      });
    }

    setTimeout(() => {
      this.scrollToForm('editingFormForRecord' + record._id);
    }, 100);
  }

  scrollToForm(id: string): void {
    const form = document.getElementById(id);
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }

  removeEditingRecord(index: number, id: any): void {
    this.editingRecords.splice(index, 1);
    // Remove the corresponding entry from recordForms
    delete this.recordForms[id];

    this.saveFormsData('editingRecords');
  }

  cancelEdit(): void {
    this.editingRecords = [];
    this.recordForms = {};
    this.clearFormsData('editingRecords');
    this.recordForm.reset();
    this.executingAction = false;
    this.feedbackMessage = '';
  }

  updateRecord(): void {
    const updatedRecord = {
      ...this.editingRecord,
      ...this.recordForm.value,
      sources: this.recordForm.value.sources?.split(',').map((source: string) => source.trim()),
      relatedLinks: this.recordForm.value.relatedLinks?.split(',').map((link: string) => link.trim())
    };

    this.recordsService.updateRecord(this.selectedCollection, updatedRecord).then(() => {
      this.recordsStateService.updateRecord(this.selectedCollection, updatedRecord);
      this.editingRecord = null;
      this.recordForm.reset();
    }).catch((error) => {
      console.error('Error updating record:', error);
    });
  }

  // Add a method to handle batch updates
  batchUpdateRecords(): void {
    // first check if all forms are valid
    if (this.editingRecords.some(record => this.recordForms[record._id].invalid)) {
      console.error('Invalid form data');
      this.executingAction = false;
      this.feedbackMessage = '';
      this.errorMessages.push('Invalid form data for editing record with id: ' + (this.editingRecords.find(record => this.recordForms[record._id].invalid)?._id + 1));
      this.icon = this.Bad;
    } else {
      const updatedRecords = this.editingRecords.map(record => {
        const form = this.recordForms[record._id];
        return {
          ...record,
          ...form.value,
          sources: form.value.sources?.split(',').map((source: string) => source.trim()),
          relatedLinks: form.value.relatedLinks?.split(',').map((link: string) => link.trim())
        };
      });
    
      Promise.all(updatedRecords.map(record => 
        this.recordsService.updateRecord(this.selectedCollection, record)
      )).then(() => {
        updatedRecords.forEach(record => this.recordsStateService.updateRecord(this.selectedCollection, record));
        this.editingRecords = [];
        this.recordForms = {};
        this.clearFormsData('editingRecords');
        this.executingAction = false;
        this.feedbackMessage = 'Records updated successfully';
        this.icon = this.Good;
      }).catch((error) => {
        console.error('Error updating records:', error);
        this.executingAction = false;
        this.feedbackMessage = '';
        this.errorMessages.push('Error updating records');
        this.icon = this.Bad;
      });
    }
  }

  deleteRecord(recordId: string): void {
    this.recordsService.deleteRecord(this.selectedCollection, recordId).then(() => {
      this.recordsStateService.deleteRecord(this.selectedCollection, recordId);
      this.executingAction = false;
      this.feedbackMessage = 'Record deleted successfully';
      this.icon = this.Good;
    }).catch((error) => {
      console.error('Error deleting record:', error);
      this.executingAction = false;
      this.feedbackMessage = '';
      this.errorMessages.push('Error deleting record');
      this.icon = this.Bad;
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

  showModalDiv(reason: string, record: any = null): void {
    this.showModal = true;
    this.feedbackMessage = '';
    this.icon = null;
    record ? this.recordForAction = record : this.recordForAction = null;
    if (reason === 'upload') {
      this.modalMessage = 'Are you sure you want to upload these records?';
    } else if (reason === 'delete') {
      this.modalMessage = 'Are you sure you want to delete this record? This cannot be undone.';
    } else if (reason === 'update') {
      this.modalMessage = this.editingRecords.length === 1 ? 'Are you sure you want to update this record?' : 'Are you sure you want to update these records?';
    } else {
      this.modalMessage = 'Are you sure you want to cancel this operation?';
    }
  }

  executeAction(action: string): void {
    this.executingAction = true;
    this.feedbackMessage = '';
    this.icon = null;
    if (action === 'upload') {
      this.addRecords();
    } else if (action === 'delete') {
      this.deleteRecord(this.recordForAction?._id);
    } else if (action === 'update') {
      this.batchUpdateRecords();  
    } else {
      this.cancelEdit();
      this.closeModalDiv();
    }
  }

  closeModalDiv(): void {
    this.showModal = false;
    this.modalMessage = '';
    this.recordForAction = null;
  }

  clearErrorMessagesLogs(): void {
    this.errorMessages = [];
  }

    // form retention methods that will be used to retain all forms data by storing them in local storage
  saveFormsData(form: string): void {
    if (form === 'all' || form === 'newRecords') {
      localStorage.setItem('newRecords', JSON.stringify(this.newRecords.map(record => record.value)));
      // console.log('saved new records form state'); // debugging log
    }
    if (form === 'all' || form === 'editingRecords') {
      localStorage.setItem('editingRecords', JSON.stringify(this.editingRecords));
      const recordFormsValues = Object.keys(this.recordForms).reduce((acc: { [key: string]: any }, key: string) => {
        acc[key] = this.recordForms[key]?.value;
        return acc;
      }, {});
      localStorage.setItem('recordForms', JSON.stringify(recordFormsValues));
      // console.log('saved editing records form state'); // debugging log
    }
  }
  
    loadFormsData(): void {
    // Load newRecords from local storage
    const newRecordsInit = localStorage.getItem('newRecords') || '';
    const newRecords = newRecordsInit !== '' ? JSON.parse(newRecordsInit) || [] : [];
    if (newRecords.length > 0) {
      this.newRecords = newRecords.map((record: any) => {
        return this.fb.group({
          ...record,
          heldBy: this.fb.group({
            team: record.heldBy?.team || '',
            person: record.heldBy?.person || '',
            nation: record.heldBy?.nation || ''
          })
        });
        });
    }
  
    // Load editingRecords from local storage
    const editingRecordsInit = localStorage.getItem('editingRecords') || '';
    const editingRecords = editingRecordsInit !== '' ? JSON.parse(editingRecordsInit) || [] : [];
    if (editingRecords.length > 0) {
      this.editingRecords = editingRecords;
    }
  
    // Load recordForms from local storage
    const recordFormsInit = localStorage.getItem('recordForms') || '';
    const recordForms = recordFormsInit !== '' ? JSON.parse(recordFormsInit) || {} : {};
    if (Object.keys(recordForms).length > 0) {
      this.recordForms = Object.keys(recordForms).reduce((acc: { [key: string]: any }, key: string) => {
        if (recordForms[key]) {
          acc[key] = this.fb.group({
            ...recordForms[key],
            heldBy: this.fb.group({
              team: [recordForms[key].heldBy?.team || ''],
              person: [recordForms[key].heldBy?.person || ''],
              nation: [recordForms[key].heldBy?.nation || '']
            })
          });
        }
        return acc;
      }, {});
    }
  }

  clearFormsData(form: string): void {
    if (form === 'all' || form === 'newRecords') {
      localStorage.removeItem('newRecords');
      // console.log('cleared new records form state'); // debugging log
    }
    if (form === 'all' || form === 'editingRecords') {
      localStorage.removeItem('editingRecords');
      localStorage.removeItem('recordForms');
      // console.log('cleared editing records form state'); // debugging log
    }
  }
}