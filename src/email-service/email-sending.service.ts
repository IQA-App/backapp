import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error, info } from 'console';

import * as nodemailer from 'nodemailer';
import type { SentMessageInfo, Transporter } from 'nodemailer';
import { env } from 'process';

@Injectable()
export class EmailSendingService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      debugger: true,
      connectionTimeout: 150000,
      greetingTimeout: 60000,
      socketTimeout: 600000,
      dnsTimeout: 60000,
      host: 'app.debugmail.io',
      port: 9025,
      secure: false,
      pool: true, //  enable connection pooling
      maxConnections: 5, // optional – defaults to 5
      maxMessages: 100, // optional – defaults to 100
      auth: {
        // user: process.env.EMAIL_TRANSPORT_USER,
        // pass: process.env.EMAIL_TRANSPORT_PASSWORD,
        user: this.configService.get('EMAIL_TRANSPORT_USER'),
        pass: this.configService.get('EMAIL_TRANSPORT_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
  }

  async sendResetPassword(toEmail: string, code: string) {
    try {
      //  we may need that in a future
      // const transporter = nodemailer.createTransport({
      //   host: 'smtp.ethereal.email',
      //   port: 587,
      //   secure: false,
      //   pool: true, //  enable connection pooling
      //   maxConnections: 5, // optional – defaults to 5
      //   maxMessages: 100, // optional – defaults to 100
      //   auth: {
      //     user: process.env.ETHEREAL_USER,
      //     pass: process.env.ETHEREAL_PASS,
      //   },
      //   tls: {
      //     ciphers: 'SSLv3',
      //   },
      // });

      const info: SentMessageInfo = await this.transporter.sendMail({
        from: `IQA-Project-Two <no-replay@iqa.project-two.com>`,
        to: toEmail,
        subject: 'confirmation code',
        text: `Hi ${toEmail} ! 👋 your code is :${code}`,
      });
      console.log('Message sent: %s', info);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      const previewUrl = nodemailer.getTestMessageUrl(info);

      // return { 'Link with your code: ': previewUrl, messageId: info.messageId };
      return { message: 'we sent confirmation code to your email' };
    } catch (err: any) {
      console.error('EMAIL SENDING error:', err);
      throw err;
    }
  }
}
