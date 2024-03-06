import { Module } from '@nestjs/common';
import { ShopeepayService } from './shopeepay.service';
import { ShopeepayController } from './shopeepay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopeepayRepository } from './repository/shopeepay.repository';
import { AdminRepository } from 'src/users/repository/admin.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/etc/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopeepayRepository, AdminRepository]),
    ShopeepayModule,
    JwtModule.register(jwtConfig)
  ],
  controllers: [ShopeepayController],
  providers: [ShopeepayService],
  exports: [ShopeepayService],
})
export class ShopeepayModule {}
