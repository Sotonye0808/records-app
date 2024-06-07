import { TestBed } from '@angular/core/testing';

import { RecordsService } from './record.service';

describe('RecordService', () => {
  let service: RecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
