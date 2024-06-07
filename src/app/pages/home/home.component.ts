import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordService } from '../../services/record.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  guinnessRecords: any[] = [];

  constructor(private recordService: RecordService) { }

  ngOnInit(): void {
  }

  fetchRecords(): void {
    this.recordService.getGuinnessRecords().subscribe((records) => {
      this.guinnessRecords = records;
    });
  }
}
