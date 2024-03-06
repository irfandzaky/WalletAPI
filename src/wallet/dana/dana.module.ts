import { Module } from '@nestjs/common';
import { DanaService } from './dana.service';
import { DanaController } from './dana.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DanaRepository } from './repository/dana.repository';
import { AdminRepository } from 'src/users/repository/admin.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/etc/config/jwt.config';
import { UserRepository } from '../../users/repository/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DanaRepository, AdminRepository, UserRepository]),
    DanaModule,
    JwtModule.register(jwtConfig)
  ],
  controllers: [DanaController],
  providers: [DanaService],
  exports: [DanaService],
})
export class DanaModule {}
