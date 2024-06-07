import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsService } from '../../services/record.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  records: any[] = [];

  constructor(private recordsService: RecordsService) { }

  ngOnInit(): void {
  }

  fetchRecords(): void {
    this.recordsService.getGuinnessRecords().then((data) => {
      this.records = data;
    }).catch((error) => {
      console.error('Error fetching records:', error);
    });
  }
}
