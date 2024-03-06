import { Module } from '@nestjs/common';
import { LinkAjaService } from './link-aja.service';
import { LinkAjaController } from './link-aja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkAjaRepository } from './repository/linkAja.repository';
import { AdminRepository } from 'src/users/repository/admin.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/etc/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkAjaRepository, AdminRepository]),
    LinkAjaModule,
    JwtModule.register(jwtConfig)
  ],
  controllers: [LinkAjaController],
  providers: [LinkAjaService],
  exports: [LinkAjaService]
})
export class LinkAjaModule {}
