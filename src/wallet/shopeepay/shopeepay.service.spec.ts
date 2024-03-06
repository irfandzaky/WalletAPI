import { Test, TestingModule } from '@nestjs/testing';
import { ShopeepayService } from './shopeepay.service';

describe('ShopeepayService', () => {
  let service: ShopeepayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopeepayService],
    }).compile();

    service = module.get<ShopeepayService>(ShopeepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
