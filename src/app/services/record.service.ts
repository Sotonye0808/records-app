import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


interface Record {
  category: string;
  title: string;
  description: string;
}

interface OlympicRecord {
  event: string;
  athlete: string;
  country: string;
  record: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor(private firestore: Firestore) {}

  getRecordsByCategory(category: string): Observable<Record[]> {
    const recordsRef = collection(this.firestore, 'records');
    const q = query(recordsRef, where('category', '==', category));
    return collectionData(q) as Observable<Record[]>;
  }

  /* getOlympicRecords(): Observable<OlympicRecord[]> {
    return this.http.get<OlympicRecord[]>(this.endpoints.olympics);
  } */

  // Add similar methods for other categories
}
