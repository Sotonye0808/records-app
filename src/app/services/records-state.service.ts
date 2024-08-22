import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordsStateService {
  private recordsSubject = new BehaviorSubject<{ [key: string]: any[] }>({});
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private errorLoadingSubject = new BehaviorSubject<boolean>(false);

  records$ = this.recordsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  errorLoading$ = this.errorLoadingSubject.asObservable();

  setRecords(records: { [key: string]: any[] }) {
    this.recordsSubject.next(records);
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  setErrorLoading(errorLoading: boolean) {
    this.errorLoadingSubject.next(errorLoading);
  }

  updateRecord(collectionName: string, updatedRecord: any) {
    const currentRecords = this.recordsSubject.getValue();
    const updatedRecords = currentRecords[collectionName].map(record =>
      record._id === updatedRecord._id ? updatedRecord : record
    );
    this.setRecords({ ...currentRecords, [collectionName]: updatedRecords });
  }

  deleteRecord(collectionName: string, recordId: string) {
    const currentRecords = this.recordsSubject.getValue();
    const updatedRecords = currentRecords[collectionName].filter(record => record._id !== recordId);
    this.setRecords({ ...currentRecords, [collectionName]: updatedRecords });
  }

  addRecord(collectionName: string, newRecord: any) {
    const currentRecords = this.recordsSubject.getValue();
    const updatedRecords = [...currentRecords[collectionName], newRecord];
    this.setRecords({ ...currentRecords, [collectionName]: updatedRecords });
  }
}