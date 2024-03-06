import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/etc/email/email.module';
import { jwtConfig } from 'src/etc/config/jwt.config';
// import { EmailModule } from 'src/modules/support/email/email.module';
import { AdminRepository } from './repository/admin.repository';
import { UserRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PenggunaRepository } from './repository/pengguna.repository';
import { AdminITRepository } from './repository/adminIT.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, AdminRepository, AdminITRepository, PenggunaRepository]),
    ConfigModule,
    EmailModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
