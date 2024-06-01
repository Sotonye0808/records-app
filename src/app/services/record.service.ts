import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


interface GuinnessRecord {
  href: string;
  text: string;
  desc: string;
  isAgeRestricted: boolean;
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
  private rapidApiKey = '363f81d9afmsh84d19069008829ap1a1297jsn0e71e9c34c3b'; // Replace with your actual API key
  private headers = new HttpHeaders({
    'x-rapidapi-key': this.rapidApiKey,
    'x-rapidapi-host': 'guinness-world-records-api.p.rapidapi.com'
  });

  private endpoints = {
    guinness: 'https://guinness-world-records-api.p.rapidapi.com/guinness/records/all',
    // Add other endpoints here as needed
  };

  constructor(private http: HttpClient) {}

  getGuinnessRecords(): Observable<GuinnessRecord[]> {
    return this.http.get<{ titlesInfo: GuinnessRecord[] }>(this.endpoints.guinness, { headers: this.headers })
      .pipe(map(response => response.titlesInfo));
  }

  /* getOlympicRecords(): Observable<OlympicRecord[]> {
    return this.http.get<OlympicRecord[]>(this.endpoints.olympics);
  } */

  // Add similar methods for other categories
}
