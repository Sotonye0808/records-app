import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RecordService } from '../../services/record.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  guinnessRecords$: Observable<Record<any, any>[]> = new Observable<Record<any, any>[]>();
  showGuinnessRecords: boolean = false;
  olympicRecords: any[] = [];

  constructor(private recordService: RecordService) {}

  fetchGuinnessRecords() {
    this.guinnessRecords$ = this.recordService.getRecordsByCategory('guinness');
    this.showGuinnessRecords = true;
  }

  /* this.recordService.getOlympicRecords().subscribe(records => {
    this.olympicRecords = records;
  }); */
}
