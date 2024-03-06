import { Test, TestingModule } from '@nestjs/testing';
import { DanaController } from './dana.controller';
import { DanaService } from './dana.service';

describe('DanaController', () => {
  let controller: DanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DanaController],
      providers: [DanaService],
    }).compile();

    controller = module.get<DanaController>(DanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
