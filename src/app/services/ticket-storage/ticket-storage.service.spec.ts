import { TestBed } from '@angular/core/testing';

import { TicketStorageService } from './ticket-storage.service';

describe('TicketStorageService', () => {
  let service: TicketStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
