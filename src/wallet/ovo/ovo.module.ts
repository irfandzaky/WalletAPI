import { Module } from '@nestjs/common';
import { OvoService } from './ovo.service';
import { OvoController } from './ovo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvoRepository } from './repository/ovo.repository';
import { AdminRepository } from 'src/users/repository/admin.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/etc/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([OvoRepository, AdminRepository]),
    OvoModule,
    JwtModule.register(jwtConfig)
  ],
  controllers: [OvoController],
  providers: [OvoService],
  exports: [OvoService],
})
export class OvoModule {}
