import { Test, TestingModule } from '@nestjs/testing';
import { OvoController } from './ovo.controller';
import { OvoService } from './ovo.service';

describe('OvoController', () => {
  let controller: OvoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvoController],
      providers: [OvoService],
    }).compile();

    controller = module.get<OvoController>(OvoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
