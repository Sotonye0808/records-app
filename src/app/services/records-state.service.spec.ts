import { TestBed } from '@angular/core/testing';

import { RecordsStateService } from './records-state.service';

describe('RecordsStateService', () => {
  let service: RecordsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
