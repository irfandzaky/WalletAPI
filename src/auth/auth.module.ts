import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/etc/config/jwt.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from 'src/etc/utils/jwt.strategy';

@Module({
  imports: [JwtModule.register(jwtConfig), TypeOrmModule.forFeature([RefreshTokenRepository]), UsersModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
