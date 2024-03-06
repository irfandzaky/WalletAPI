import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaksiRepository } from './repository/transaksi.repository';
import { UserRepository } from '../users/repository/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../etc/config/jwt.config';
import { PenggunaRepository } from '../users/repository/pengguna.repository';
import { AdminRepository } from '../users/repository/admin.repository';
import { DanaRepository } from '../wallet/dana/repository/dana.repository';
import { OvoRepository } from '../wallet/ovo/repository/ovo.repository';
import { GopayRepository } from '../wallet/gopay/repository/gopay.repository';
import { LinkAjaRepository } from '../wallet/link-aja/repository/linkAja.repository';
import { ShopeepayRepository } from '../wallet/shopeepay/repository/shopeepay.repository';
import { RefundRepository } from '../refund/repository/refund.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransaksiRepository, UserRepository,AdminRepository, DanaRepository, OvoRepository,GopayRepository,LinkAjaRepository,ShopeepayRepository, RefundRepository]),
    JwtModule.register(jwtConfig)
  ],
  controllers: [TransaksiController],
  providers: [TransaksiService],
  exports: [TransaksiService]

})
export class TransaksiModule {}
