import { TestBed } from '@angular/core/testing';

import { Random } from './random';

describe('Random', () => {
  let service: Random;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Random);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
