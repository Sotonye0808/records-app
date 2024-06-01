import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  guinnessRecords: any[] = [];
  showGuinnessRecords: boolean = false;
  olympicRecords: any[] = [];

  constructor(private recordService: RecordService) { }

  ngOnInit(): void {}

  fetchGuinnessRecords(): void {
    this.recordService.getGuinnessRecords().subscribe(records => {
      this.guinnessRecords = records;
      this.showGuinnessRecords = true;
    });
  }

  /* this.recordService.getOlympicRecords().subscribe(records => {
    this.olympicRecords = records;
  }); */
}
