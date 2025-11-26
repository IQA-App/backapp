import { Injectable } from '@nestjs/common';
import { error, info } from 'console';

import * as nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';
import { env } from 'process';

@Injectable()
export class EmailSendingService {
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

      const transporter = nodemailer.createTransport({
        host: 'app.debugmail.io',
        port: 25,
        secure: false,
        pool: true, //  enable connection pooling
        maxConnections: 5, // optional – defaults to 5
        maxMessages: 100, // optional – defaults to 100
        auth: {
          user: process.env.EMAIL_TRANSPORT_USER,
          pass: process.env.EMAIL_TRANSPORT_PASSWORD,
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });

      const info: SentMessageInfo = await transporter.sendMail({
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
      return { message: 'we sent confirmation to your email' };
    } catch (err: any) {
      console.error('EMAIL SENDING error:', err);
      throw err;
    }
  }
}
