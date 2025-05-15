import { TestBed } from '@angular/core/testing';

import { RestInterceptorsService } from './rest-interceptors.service';

describe('RestInterceptorsService', () => {
  let service: RestInterceptorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestInterceptorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
