import { Test, TestingModule } from '@nestjs/testing';
import { ShopeepayController } from './shopeepay.controller';
import { ShopeepayService } from './shopeepay.service';

describe('ShopeepayController', () => {
  let controller: ShopeepayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopeepayController],
      providers: [ShopeepayService],
    }).compile();

    controller = module.get<ShopeepayController>(ShopeepayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
