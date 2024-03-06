import { Module } from '@nestjs/common';
import { GopayService } from './gopay.service';
import { GopayController } from './gopay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GopayRepository } from './repository/gopay.repository';
import { AdminRepository } from 'src/users/repository/admin.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/etc/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([GopayRepository, AdminRepository]),
    GopayModule,
    JwtModule.register(jwtConfig)
  ],
  controllers: [GopayController],
  providers: [GopayService],
  exports: [GopayService],
})
export class GopayModule {}
