import 'dotenv/config'; 
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentUtils } from './etc/utils/enviroment.utils';

const port = process.env.PORT;  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*"
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidUnknownValues: true,
    transform: true
  }));
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Transfer Dompet Digital')
    .setDescription('API Sistem Transfer Dompet Digital, untuk lebih detail silahkan lihat dokumen berikut: [PDF Documentation](https://drive.google.com/file/d/16Z3V9AHNiqdwlP6nIxCpEAuWEPxWdHir/view?usp=sharing).')
    .setVersion('1.0')
    .addTag('Users', 'Lihat Data, Register, Update, Konfirmasi Email, dan Manajemen Password')
    .addTag('Auth', 'Login/Logout/Minta Akses Token')
    .addTag('Transaksi', 'Proses Melakukan Transaksi bagi Pengguna dan Pengecekan bagi Admin')
    .addTag('Refund', 'Proses Pengembalian Dana bagi Pengguna dan Pengecekan bagi Admin')
    .addTag('Dana', 'Pengelolaan Dompet Digital Dana')
    .addTag('Ovo', 'Pengelolaan Dompet Digital Ovo')
    .addTag('Gopay', 'Pengelolaan Dompet Digital Gopay')
    .addTag('LinkAja', 'Pengelolaan Dompet Digital LinkAja')
    .addTag('Shopeepay', 'Pengelolaan Dompet Digital Shopeepay')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const isProduction = new EnvironmentUtils().isProduction();

  if (!isProduction) {
    SwaggerModule.setup('docs', app, document);
  }
  
  await app.listen(3000);
}
bootstrap();
