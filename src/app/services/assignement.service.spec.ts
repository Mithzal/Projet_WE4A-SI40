import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {AssignmentService} from "./assignment.service";

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
