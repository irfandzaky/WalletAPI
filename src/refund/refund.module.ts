import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { TransaksiRepository } from 'src/transaksi/repository/transaksi.repository';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundRepository, UserRepository,AdminRepository, DanaRepository, OvoRepository,GopayRepository,LinkAjaRepository,ShopeepayRepository, TransaksiRepository]),
    JwtModule.register(jwtConfig)
  ],
  controllers: [RefundController],
  providers: [RefundService],
  exports: [RefundService]

})
export class RefundModule {}