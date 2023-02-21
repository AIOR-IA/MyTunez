import { TestBed } from '@angular/core/testing';

import { RegistrationLogicService } from './registration-logic.service';

describe('RegistrationLogicService', () => {
  let service: RegistrationLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
