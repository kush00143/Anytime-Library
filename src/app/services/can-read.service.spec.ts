import { TestBed } from '@angular/core/testing';

import { CanReadService } from './can-read.service';

describe('CanReadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanReadService = TestBed.get(CanReadService);
    expect(service).toBeTruthy();
  });
});
