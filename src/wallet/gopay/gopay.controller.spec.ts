import { Test, TestingModule } from '@nestjs/testing';
import { GopayController } from './gopay.controller';
import { GopayService } from './gopay.service';

describe('GopayController', () => {
  let controller: GopayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GopayController],
      providers: [GopayService],
    }).compile();

    controller = module.get<GopayController>(GopayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
