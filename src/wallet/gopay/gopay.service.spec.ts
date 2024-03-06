import { Test, TestingModule } from '@nestjs/testing';
import { GopayService } from './gopay.service';

describe('GopayService', () => {
  let service: GopayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GopayService],
    }).compile();

    service = module.get<GopayService>(GopayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
