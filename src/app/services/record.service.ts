import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GuinnessRecord {
  title: string;
  description: string;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = 'https://records-sphere.netlify.app/api';  // Replace with your deployed Vercel URL

  constructor(private http: HttpClient) { }

  getGuinnessRecords(): Observable<GuinnessRecord[]> {
    return this.http.get<GuinnessRecord[]>(`${this.apiUrl}/guinness`);
  }
}
