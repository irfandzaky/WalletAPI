import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entity/users.entity';
import { Admin } from './users/entity/admin.entity';
import { RefreshToken } from './auth/entity/refresh-token.entity';
import { TransaksiModule } from './transaksi/transaksi.module';
import { Pengguna } from './users/entity/pengguna.entity';
import { Transaksi } from './transaksi/entities/transaksi.entity';
import { Dana } from './wallet/dana/entities/dana.entity';
import { Gopay } from './wallet/gopay/entities/gopay.entity';
import { LinkAja } from './wallet/link-aja/entities/linkaja.entity';
import { Ovo } from './wallet/ovo/entities/ovo.entity';
import { Shopeepay } from './wallet/shopeepay/entities/shopeepay.entity';
import { DanaModule } from './wallet/dana/dana.module';
import { OvoModule } from './wallet/ovo/ovo.module';
import { GopayModule } from './wallet/gopay/gopay.module';
import { LinkAjaModule } from './wallet/link-aja/link-aja.module';
import { ShopeepayModule } from './wallet/shopeepay/shopeepay.module';
import { AdminIT } from './users/entity/adminIt.entity';
import { Refund } from './refund/entities/refund.entity';
import { RefundModule } from './refund/refund.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host : process.env.MYSQL_HOST,
      port : parseInt(process.env.MYSQL_PORT),
      username : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DB,
      entities: [
        User,
        Admin,
        AdminIT,
        Pengguna,
        Dana,
        Gopay,
        LinkAja,
        Ovo,
        Shopeepay,
        RefreshToken,
        Transaksi,
        Refund,
      ],
      synchronize: true
    }), 
    UsersModule, 
    AuthModule,
    TransaksiModule,
    DanaModule,
    OvoModule,
    GopayModule,
    LinkAjaModule,
    ShopeepayModule,
    TransaksiModule,
    RefundModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 