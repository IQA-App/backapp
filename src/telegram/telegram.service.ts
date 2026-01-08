import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private readonly bot: any;
  private logger = new Logger(TelegramService.name);

  constructor(private configService: ConfigService) {
    const TELEGRAM_TOKEN = this.configService.get('TELEGRAM_TOKEN');

    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    this.bot.on('message', this.onReceiveMessage);
  }

  onReceiveMessage = (msg: any) => {
    this.logger.debug(`Telegram chat ID: ${msg.chat.id}`);
    this.logger.debug(`Telegram text: ${msg.text}`);
    this.logger.debug(msg);

    this.bot.startPolling();

    this.bot.on('polling_error', (err) =>
      console.log('Telegram Polling error:', err.message),
    );
    this.bot.on('webhook_error', (err) =>
      console.log('Telegram Webhook error:', err.message),
    );

    this.logger.log('Telegram bot is launching...');
  };

  async sendMessage(chatId: string | number, text: string) {
    try {
      await this.bot.sendMessage(chatId, text);
    } catch (error) {
      this.logger.error(`Can not send a message: ${error.message}`);
    }
  }
}
