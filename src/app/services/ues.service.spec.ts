import { TestBed } from '@angular/core/testing';

import { UEsService } from './ues.service';

describe('UEsService', () => {
  let service: UEsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UEsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
