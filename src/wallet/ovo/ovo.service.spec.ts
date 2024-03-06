import { Test, TestingModule } from '@nestjs/testing';
import { OvoService } from './ovo.service';

describe('OvoService', () => {
  let service: OvoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvoService],
    }).compile();

    service = module.get<OvoService>(OvoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
