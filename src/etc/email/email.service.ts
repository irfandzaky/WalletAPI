import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.get('MAIL_HOST'),
      // service: configService.get('MAIL_GMAIL'),
      // kode diatas jika ingin menggunakan GMAIL
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get('MAIL_USERNAME'),
        pass: configService.get('MAIL_PASSWORD'),
        // user: configService.get('MAIL_KLIRING'),
        // pass: configService.get('MAIL_PASSKLIRING'),
        // Kode diatas jika ingin menggunakan GMAIL
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}