import { TestBed } from '@angular/core/testing';

import { GoogleBookService } from './google-book.service';

describe('GoogleBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleBookService = TestBed.get(GoogleBookService);
    expect(service).toBeTruthy();
  });
});
