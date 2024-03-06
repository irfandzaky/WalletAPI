import { Test, TestingModule } from '@nestjs/testing';
import { LinkAjaService } from './link-aja.service';

describe('LinkAjaService', () => {
  let service: LinkAjaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkAjaService],
    }).compile();

    service = module.get<LinkAjaService>(LinkAjaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
