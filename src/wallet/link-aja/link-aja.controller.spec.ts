import { Test, TestingModule } from '@nestjs/testing';
import { LinkAjaController } from './link-aja.controller';
import { LinkAjaService } from './link-aja.service';

describe('LinkAjaController', () => {
  let controller: LinkAjaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkAjaController],
      providers: [LinkAjaService],
    }).compile();

    controller = module.get<LinkAjaController>(LinkAjaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
