import { Test, TestingModule } from '@nestjs/testing';
import { TransaksiService } from './transaksi.service';

describe('TransaksiService', () => {
  let service: TransaksiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransaksiService],
    }).compile();

    service = module.get<TransaksiService>(TransaksiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
