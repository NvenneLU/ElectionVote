import { TestBed } from '@angular/core/testing';

import { VoteManagerService } from './vote-manager.service';

describe('VoteManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoteManagerService = TestBed.get(VoteManagerService);
    expect(service).toBeTruthy();
  });
});
